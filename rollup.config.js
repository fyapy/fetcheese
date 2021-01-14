import { join } from 'path'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const getOutput = format => ({
  // preserveModules: true,
  dir: format,
  format: format,
  sourcemap: false,
})
const getConfig = module => ({
  input: {
    index: 'src/index.ts',
    'server/fetch': 'src/server/fetch.ts',
    'server/xmlhttprequest': 'src/server/xmlhttprequest.ts',
    'server/index': 'src/server/index.ts',
    'fetch/downloadProgress': 'src/fetch/downloadProgress.ts',
  },
  treeshake: true,
  output: module,
  plugins: [
    resolve(),
    typescript({
      outDir: module.dir,
      tsconfig: join(process.cwd(), 'tsconfig.prod.json')
    }),
    terser(),
  ],
  external: ['isomorphic-fetch', 'node-abort-controller', 'xhr2'],
})

export default [
  getConfig(getOutput('esm')),
  getConfig(getOutput('cjs')),
]
