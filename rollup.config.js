import svelte from 'rollup-plugin-svelte';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import glob from 'glob';

const svelteConfig = require('./svelte.config.js');

const production = !process.env.ROLLUP_WATCH;
const svelteFiles = glob.sync('**/*.svelte');

export default {
  input: svelteFiles,
  output: {
    sourcemap: !production,
    format: 'esm',
    dir: 'dist',
  },
  plugins: [
    svelte({
      ...svelteConfig,
      dev: !production,
    }),
    nodeResolve({
      browser: true,
      dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
    }),
    commonjs(),

    production && terser(),
  ],
};
