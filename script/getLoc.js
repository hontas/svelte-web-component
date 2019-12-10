const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'src/components/Button/Button.svelte');
const content = fs.readFileSync(filePath);

function getLoc(fileContent, index) {
  const preContent = fileContent.slice(0, index);
  const lines = preContent.split(/\n/);
  const preIndex = lines.slice(0, -1).join('\n').length;

  return {
    line: lines.length,
    col: index - preIndex,
  };
}

const regex = /padding/g;
const match = regex.exec(content);
if (!match) return process.exit(0);

const { index, input } = match;
const loc = getLoc(input, index);

console.log(`${filePath}:${loc.line}:${loc.col}`);
return process.exit(0);
