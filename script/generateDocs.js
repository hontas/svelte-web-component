const fs = require('fs');
const path = require('path');
const glob = require('glob');
const sveltedoc = require('sveltedoc-parser');

const svelteFiles = glob.sync('**/*.svelte');

svelteFiles.forEach(filename => {
  const dir = path.dirname(filename);

  sveltedoc
    .parse({ filename, version: 3 })
    .then(doc => {
      // console.log(doc);
      const readme = genReadme(doc);
      const filePath = path.resolve(dir, 'README.md');
      console.log(readme);
      fs.writeFileSync(filePath, readme, 'utf8');
    })
    .catch(e => console.error(e));
});

function genReadme({ name, slots, data }) {
  return `# ${name}

## slots

${slots.map(slot => `- ${slot.name}`).join('\n')}

## attributes

${data.map(attr => `- ${attr.name}`).join('\n')}
`;
}
