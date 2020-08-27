import pkg from './package.json';
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import buble from 'rollup-plugin-buble';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import url from 'postcss-url';
export default {
  input: './src/index.ts',
  plugins: [
    // less(),
    typescript({
      exclude: 'node_modules/**',
      typescript: require('typescript')
    }),
    resolve({
      preferBuiltins: false
    }),
    postcss({
      plugins: [
        url({ url: 'inline' })
      ]
    }),
    commonjs({
      namedExports: {
        eventemitter3: [ 'EventEmitter' ],
        lodash: [ 'merge' ]
      }
    }),
    buble({
      transforms: { generator: false }
    }),
    terser()
  ],
  external: [
    '@cgcs2000/l7'
  ],
  output: [
    {
      format: 'umd',
      name: 'L7-Three',
      file: pkg.unpkg,
      sourcemap: true,
      globals: {
        '@cgcs2000/l7': 'L7'
      }
    }
  ]
};

