import process from 'process'
import { cac } from 'cac'
import { build } from './build'

const cli = cac('vite-react-static')

cli
  .command('build', 'Build SSG')
  .option('--script <script>', 'Rewrites script loading timing')
  .option('--mock', 'Mock browser globals (window, document, etc.) for SSG')
  .option('--mode <mode>', 'Specify the mode the Vite process is running in')
  .option('--config, -c <config>', 'The vite config file to use')
  .option('--base, -b <base>', 'The base path to render')
  .action(async (args) => {
    await build()
  })

cli.help()
cli.parse(process.argv)

export {}
