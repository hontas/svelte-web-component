import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const previewRelativePath = '.storybook/preview-head.html';
const previewFilePath = path.join(__dirname, previewRelativePath);

export default function myExample({ files }) {
  return {
    name: 'generate-preview-head-4-storybook',
    buildEnd(error) {
      if (error) return;

      const content = files
        .map(file =>
          file
            .split('/')
            .pop()
            .replace(/\.svelte/, '.js')
        )
        .map(file => `<script type="module" src="./${file}"></script>`)
        .join('\n');

      fs.writeFile(previewFilePath, content, 'utf8', err => {
        if (err) {
          process.stdout.write(chalk.yellow(`Error generating ./${previewRelativePath}`), err);
        } else {
          process.stdout.write(chalk.dim(`Generated ./${previewRelativePath}\n`));
        }
      });
    },
  };
}
