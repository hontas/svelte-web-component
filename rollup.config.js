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

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    nodeResolve({
      browser: true,
      dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
    }),
    commonjs(),

    production && terser(),
  ],
};
