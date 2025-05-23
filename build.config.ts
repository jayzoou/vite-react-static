import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    { input: 'src/index', name: 'index' },
    // { input: 'src/client/single-page', name: 'client/single-page' },
    { input: 'src/node/cli', name: 'node/cli' },
    { input: 'src/node', name: 'node' },
  ],
  clean: true,
  declaration: true,
  externals: [
    'react',
    'vite',
  ],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
