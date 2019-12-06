const fs = require('fs');
const util = require('util');
const path = require('path');

const sass = require('node-sass');
const doiuse = require('doiuse');
const chalk = require('chalk');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');

const readFile = util.promisify(fs.readFile);

module.exports = {
  customElement: true,

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
              console.log(`${chalk.gray(dir)}/${base}\n${chalk.yellowBright(warnings.join(''))}`);
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
};
