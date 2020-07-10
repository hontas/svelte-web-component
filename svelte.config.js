const fs = require('fs');
const util = require('util');
const path = require('path');

const doiuse = require('doiuse');
const chalk = require('chalk');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');

const readFile = util.promisify(fs.readFile);

module.exports = {
  customElement: true,

  preprocess: {
    async style({ content, attributes, filename }) {
      const getContent = async () => {
        if (!attributes.src) return Promise.resolve({ code: content });
        const code = await readFile(path.resolve(path.dirname(filename), attributes.src));
        return { code };
      };

      const postProcess = ({ code, dependencies = [] }) =>
        postcss([
          autoprefixer,
          doiuse({
            onFeatureUsage(usageInfo) {
              const [filePath, , ...warnings] = usageInfo.message.split(/(:\s)/);
              const { dir, base } = path.parse(filePath);
              process.stdout.write(
                `${chalk.gray(dir)}/${base}\n${chalk.yellowBright(warnings.join(''))}`
              );
            },
          }),
        ])
          .process(code, { from: filename })
          .then(result => ({ code: result.css, dependencies }));

      return getContent().then(postProcess);
    },
  },
};
