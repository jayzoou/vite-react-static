import process from 'process'
import fs from 'fs/promises'
import { dirname, isAbsolute, join, parse } from 'path'
import { render } from './reader';

export async function build() {
  console.log('Building the project...');
  const entry = await detectEntry(process.cwd())
  console.log(`Entry file: ${entry}`);
  render()
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
