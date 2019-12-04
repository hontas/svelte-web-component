import fs from 'fs';
import util from 'util';
import path from 'path';

import svelte from 'rollup-plugin-svelte';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import glob from 'glob';
import sass from 'node-sass';
import doiuse from 'doiuse';
import chalk from 'chalk';

const readFile = util.promisify(fs.readFile);

const autoprefixer = require('autoprefixer');
const postcss = require('postcss');

const svelteConfig = require('./svelte.config.js');

const production = !process.env.ROLLUP_WATCH;
const svelteFiles = glob.sync('**/*.svelte');

export default {
  input: svelteFiles,
  output: {
    sourcemap: true,
    format: 'esm',
    dir: 'dist',
  },
  plugins: [
    svelte({
      ...svelteConfig,
      dev: !production,
      preprocess: {
        async style({ content, attributes, filename }) {
          const { lang, src } = attributes;

          if (!lang && !src) return undefined;

          const getContent = () => {
            if (!src) return content;
            return readFile(path.resolve(path.dirname(filename), src));
          };

          const transformLang = async code => {
            if (lang !== 'scss') return { code };

            const { css, stats } = await new Promise((resolve, reject) => {
              sass.render(
                {
                  file: filename,
                  data: code,
                  includePaths: ['src'],
                },
                (err, result) => {
                  if (err) reject(err);
                  else resolve(result);
                }
              );
            });

            return { code: css, dependencies: stats.includedFiles };
          };

          const postProcess = ({ code, dependencies = [] }) =>
            postcss([
              autoprefixer,
              doiuse({
                onFeatureUsage(usageInfo) {
                  const [filePath, , ...warnings] = usageInfo.message.split(/(:\s)/);
                  const { dir, base } = path.parse(filePath);
                  console.log(
                    `${chalk.gray(dir)}/${base}\n${chalk.yellowBright(warnings.join(''))}`
                  );
                },
              }),
            ])
              .process(code, { from: filename })
              .then(result => ({ code: result.css, dependencies }));

          return new Promise((resolve, reject) => {
            Promise.resolve(getContent())
              .then(transformLang)
              .then(postProcess)
              .then(result => {
                // console.log('result', filename, result);
                return result;
              })
              .then(resolve)
              .catch(reject);
          });
        },
      },
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
