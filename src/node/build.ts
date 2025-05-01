import process from 'process'
import fs from 'fs/promises'
import { dirname, isAbsolute, join, parse } from 'path'
import { mergeConfig, resolveConfig, build as viteBuild } from 'vite'
import { renderReactNode, renderHTML } from './reader'


export async function build(staticOptions: any, viteConfig = {}) {
  console.log('Building the project...', staticOptions)
  console.log('Vite config:', viteConfig)
  const nodeEnv = process.env.NODE_ENV || 'production'
  const mode = process.env.MODE || staticOptions.mode || nodeEnv
  const config = await resolveConfig(viteConfig, 'build', mode, nodeEnv)
  const mergedOptions = Object.assign({}, config.staticOptions || {}, staticOptions)
  const { base } = mergedOptions
  console.log('Resolved Vite config:', mergedOptions)
  const cwd = process.cwd()
  const root = cwd
  const entry = await detectEntry(cwd)
  // const { creatRoot } = await import(entry)
  // console.log('creatRoot', creatRoot)
  // console.log(`Entry file: ${entry}`);
  // const appHTML = await renderReactNode()
  // console.log(appHTML, 'appHtml')
  const outDir = 'dist'
  const out = isAbsolute(outDir) ? outDir : join(root, outDir)
  const filename = 'index.html'
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
  const format = 'esm'
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

  const serverEntry = prefix + join(ssgOut, parse(ssrEntry).name + ext).replace(/\\/g, '/')
  console.log('Server entry:', serverEntry)
  const { createRoot } = await import(serverEntry)
  const { App } = createRoot()
  console.log('App:', App)
  const appHTML = await renderReactNode({
    ReactNode: App
  })
  console.log(appHTML, 'appHtml')

  await fs.rm(ssgOutTempFolder, { recursive: true, force: true })
  let indexHTML = await fs.readFile(join(out, 'index.html'), 'utf-8')
  const renderedHTML = await renderHTML({
    indexHTML,
    appHTML,
  })
  await fs.mkdir(join(out, dirname(filename)), { recursive: true })
  await fs.writeFile(join(out, filename), renderedHTML, 'utf-8')
  // Here you would add the logic to build your project.
  // This is a placeholder for the actual build process.
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
