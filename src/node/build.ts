import process from 'process'
import fs from 'fs/promises'
import { dirname, isAbsolute, join, parse } from 'path'
import { resolveConfig } from 'vite'
import { render } from './reader'


export async function build(staticOptions: any, viteConfig = {}) {
  console.log('Building the project...', staticOptions)
  console.log('Vite config:', viteConfig)
  const nodeEnv = process.env.NODE_ENV || 'production'
  const mode = process.env.MODE || staticOptions.mode || nodeEnv
  const config = await resolveConfig(viteConfig, 'build', mode, nodeEnv)
  const mergedOptions = Object.assign({}, config.staticOptions || {}, staticOptions)
  console.log('Resolved Vite config:', mergedOptions)
  const cwd = process.cwd()
  const root = cwd
  const entry = await detectEntry(cwd)
  console.log(`Entry file: ${entry}`);
  const appHtml = await render()
  console.log(appHtml, 'appHtml')
  const outDir = 'dist'
  const out = isAbsolute(outDir) ? outDir : join(root, outDir)
  const filename = 'app.html'
  let indexHTML = await fs.readFile(join(root, 'index.html'), 'utf-8')
  await fs.mkdir(join(out, dirname(filename)), { recursive: true })
  await fs.writeFile(join(out, filename), indexHTML, 'utf-8')
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
