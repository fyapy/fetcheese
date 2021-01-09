import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const getOutput = format => ({
  preserveModules: true,
  dir: `lib/${format}`,
  format: format,
})
const getConfig = module => ({
  input: [
    'src/index.ts',
    'src/server.ts',
  ],
  treeshake: true,
  output: module,
  plugins: [
    resolve(),
    typescript({
      outDir: module.dir,
    }),
    terser(),
  ],
  external: ['isomorphic-fetch'],
})

export default [
  getConfig(getOutput('esm')),
  getConfig(getOutput('cjs')),
]
