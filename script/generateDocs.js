const fs = require('fs');
const path = require('path');
const glob = require('glob');
const sveltedoc = require('sveltedoc-parser');

const svelteFiles = glob.sync('**/*.svelte');

const transformData = ({ name, description, type, defaultValue }) => ({
  name,
  description: description || '',
  type: type.type ? type.type : type,
  defaultValue,
});

svelteFiles.forEach(filename => {
  const dir = path.dirname(filename);

  sveltedoc
    .parse({
      version: 3,
      filename,
      features: ['name', 'data', 'components', 'description', 'events', 'slots'],
      ignoredVisibilities: [],
    })
    .then(doc => {
      if (Array.isArray(doc.data)) {
        return {
          ...doc,
          data: doc.data.filter(({ visibility }) => visibility === 'public').map(transformData),
        };
      }
      return doc;
    })
    .then(doc => {
      // console.log(JSON.stringify(doc, null, 2));
      const readme = genReadme(doc);
      console.log(readme);
      const filePath = path.resolve(dir, 'README.md');
      fs.writeFileSync(filePath, readme, 'utf8');
    })
    .catch(e => console.error(e));
});

const printAttr = ({ name, description, type, defaultValue }) => {
  const isRequired = typeof defaultValue === 'undefined';
  let result = `- ${name} {${type}} `;
  if (isRequired) {
    result += `| required`;
  } else {
    result += `| default "${defaultValue}"`;
  }
  if (description)
    result += `  
  - ${description}`;
  return result;
};

function genReadme({ name, slots = [], data = [] }) {
  return `# ${name}

## slots

${slots.map(slot => `- ${slot.name}`).join('\n')}

## attributes

${data.map(printAttr).join('\n')}
`;
}
