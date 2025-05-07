import process from 'process'
import fs from 'fs/promises'
import { isAbsolute, join, parse } from 'path'
import { mergeConfig, resolveConfig, build as viteBuild } from 'vite'
import { renderReactNode, renderHTML } from './reader'


export async function build(staticOptions: any, viteConfig = {}) {
  console.log('Building the project...', staticOptions)
  console.log('Vite config:', viteConfig)
  const cwd = process.cwd()
  const nodeEnv = process.env.NODE_ENV || 'production'
  const mode = process.env.MODE || staticOptions.mode || nodeEnv
  const config = await resolveConfig(viteConfig, 'build', mode, nodeEnv)
  const root = config.root || cwd
  const outDir = config.build.outDir || 'dist'
  const out = isAbsolute(outDir) ? outDir : join(root, outDir)
  const mergedOptions = Object.assign({}, config.staticOptions || {}, staticOptions)
  const { 
    script = 'sync',
    format = 'esm',
    entry = await detectEntry(cwd),
    base
   } = mergedOptions
  console.log('Resolved Vite config:', mergedOptions)

  // build the client
  await viteBuild(mergeConfig(viteConfig, {
    base,
    mode,
    build: {
      emptyOutDir: true,
      ssrManifest: true,
      rollupOptions: {
        input: {
          app: join(root, './index.html'),
        }
      },
    },
  })).catch((err) => {
    console.error('Build failed:', err)
    process.exit(1)
  })
 
  const ssgOutTempFolder = join(root, '.vite-static-temp')
  const ssgOut = join(ssgOutTempFolder, Math.random().toString(36).substring(2, 12))
  const ssrEntry = await join(root, entry)
  console.log('ssrEntry', ssrEntry)

  // build the server entry
  await viteBuild(mergeConfig(viteConfig, {
    base,
    build: {
      ssr: ssrEntry,
      outDir: ssgOut,
      emptyOutDir: true,
      minify: false,
      cssCodeSplit: false,
      rollupOptions: {
        output: format === 'esm'
          ? {
              entryFileNames: '[name].mjs',
              format: 'esm',
            }
          : {
              entryFileNames: '[name].cjs',
              format: 'cjs',
            },
      },
    },
    mode: config.mode,
    ssr: {
      noExternal: ['vite-react-static'],
    },
  })).catch(e => {
    console.log(e, 'ee')
  })

  const prefix = (format === 'esm' && process.platform === 'win32') ? 'file://' : ''
  const ext = format === 'esm' ? '.mjs' : '.cjs'

  let indexHTML = await fs.readFile(join(out, 'index.html'), 'utf-8')
  indexHTML = rewriteScripts(indexHTML, script)

  const serverEntry = prefix + join(ssgOut, parse(ssrEntry).name + ext).replace(/\\/g, '/')

  const { createRoot } = await import(serverEntry)
  const { routes } = createRoot()
  const routesPaths = routesToPaths(routes)

  for (const route of routesPaths) {
    const routeOut = join(out, route)
    const { App, rootContainerId } = createRoot(route)
    const appHTML = await renderReactNode({
      ReactNode: App
    })

    const renderedHTML = await renderHTML({
      rootContainerId,
      indexHTML,
      appHTML,
    })
    if(route !== '/') {
      await fs.mkdir(routeOut, { recursive: true }) 
    }
    await fs.writeFile(join(routeOut, 'index.html'), renderedHTML, 'utf-8')
  }

  await fs.rm(ssgOutTempFolder, { recursive: true, force: true })
}


async function detectEntry(root: string) {
  // pick the first script tag of type module as the entry
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  const scriptSrcReg = /<script.*?src=["'](.+?)["'](?!<).*>\s*<\/script>/gi
  const html = await fs.readFile(join(root, 'index.html'), 'utf-8')
  const scripts = [...html.matchAll(scriptSrcReg)]
  const [, entry] = scripts.find((matchResult) => {
    const [script] = matchResult
    const [, scriptType] = script.match(/.*\stype=(?:'|")?([^>'"\s]+)/i) || []
    return scriptType === 'module'
  }) || []
  return entry || 'src/main.ts'
}

function routesToPaths(routes?: any) {
  if(!routes) return ['/']

  return routes.map((route: any) => {
    const { path, children } = route
    if (children) {
      return [path, ...routesToPaths(children)]
    }
    return path
  })
    .flat()
}

function rewriteScripts(indexHTML: string, mode?: string) {
  if (!mode || mode === 'sync')
    return indexHTML
  return indexHTML.replace(/<script type="module" /g, `<script type="module" ${mode} `)
}
