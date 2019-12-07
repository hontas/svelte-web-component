/**
 * @fileoverview Rule to warn on possible problem with boolean prop
 * @author Pontus Lundin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const isVariableDeclaration = ({ type }) => type === 'VariableDeclarator';
const hasDefaultValue = ({ init }) => init && typeof init.value !== 'undefined';

module.exports = {
  meta: {
    type: 'problem',

    docs: {
      description: 'warn on problematic-boolean props',
      category: 'Possible Errors',
      recommended: true,
      url: '',
    },
    schema: [], // no options
  },
  create(context) {
    const problematicNode = {};
    let currLevel;

    return {
      ExportNamedDeclaration(node) {
        if (node.declaration == null) return;

        const { type, kind, declarations } = node.declaration;

        if (type === 'VariableDeclaration' && kind === 'let') {
          declarations.forEach(declaration => {
            if (isVariableDeclaration(declaration) && hasDefaultValue(declaration)) {
              if (typeof declaration.init.value === 'boolean') {
                problematicNode[currLevel][declaration.id.name] = node;
              }
            }
          });
        }
      },
      LabeledStatement(node) {
        if (node.body.type === 'BlockStatement') {
          node.body.body.forEach(childNode => {
            if (childNode.type !== 'IfStatement') return;
            if (childNode.test.type !== 'CallExpression') return;
            if (childNode.test.callee.name !== 'isBoolAttr') return;

            const variable = childNode.test.arguments[0];

            if (childNode.consequent.type !== 'ExpressionStatement') return;
            if (childNode.consequent.expression.type !== 'AssignmentExpression') return;
            if (childNode.consequent.expression.left.type !== 'Identifier') return;
            if (childNode.consequent.expression.left.name !== variable.name) return;
            if (childNode.consequent.expression.right.type !== 'Literal') return;
            if (childNode.consequent.expression.right.value !== true) return;

            delete problematicNode[currLevel][variable.name];
          });
        }
      },
      onCodePathStart(codePath) {
        currLevel = codePath.id;
        problematicNode[codePath.id] = {};
      },
      onCodePathEnd(codePath) {
        if (codePath.upper) currLevel = codePath.upper.id;
        Object.entries(problematicNode[codePath.id]).forEach(([name, node]) => {
          context.report(
            node,
            `Exported boolean property '${name}' must convert '' (empty string) to true, cause '' === true in the DOM. $: { if (isBoolAttr(${name}) ${name} = true; ) }`
          );
        });

        if (problematicNode[codePath.id]) {
          delete problematicNode[codePath.id];
        }
      },
    };
  },
};
