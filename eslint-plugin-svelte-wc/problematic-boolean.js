/**
 * @fileoverview Rule to warn on possible problem with boolean prop
 * @author Pontus Lundin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const t = require('@babel/types');
const doctrine = require('doctrine');

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
    const sourceCode = context.getSourceCode();

    let currLevel;
    let localName = 'getBool';

    const getJSDocComment = node => {
      const comments = sourceCode.getCommentsBefore(node);
      const lastComment = comments[comments.length - 1];
      if (!lastComment || lastComment.type !== 'Block') return null;

      return doctrine.parse(`/*${lastComment.value}*/`, { unwrap: true });
    };

    /**
     * Get types from JSDoc comment
     * @param {ast} node
     * @returns {array}
     */
    const getTypeFromJSDocComment = node => {
      const jsDoc = getJSDocComment(node);
      if (!jsDoc) return [];

      const typeTag = jsDoc.tags.find(({ title }) => title === 'type');
      if (!typeTag || !typeTag.type) return null;

      if (typeTag.type.type === 'NameExpression') return [typeTag.type.name];
      if (typeTag.type.type === 'UnionType') return typeTag.type.elements.map(({ name }) => name);

      console.warn('Unhandled type', typeTag);

      return [];
    };

    return {
      ImportDeclaration(node) {
        if (!t.isLiteral(node.source)) return;
        if (/\/utils\/getBool(\.js)?/.test(node.source.value)) {
          if (node.specifiers.length === 0) return;

          const specifier = node.specifiers[0];

          if (!t.isImportDefaultSpecifier(specifier)) return;
          if (!t.isIdentifier(specifier.local)) return;

          localName = specifier.local.name;
        }
      },

      ExportNamedDeclaration(node) {
        if (node.declaration == null) return;

        const { type, kind, declarations } = node.declaration;

        if (type === 'VariableDeclaration' && kind === 'let') {
          declarations.forEach(declaration => {
            if (!isVariableDeclaration(declaration)) return;

            if (hasDefaultValue(declaration)) {
              if (typeof declaration.init.value === 'boolean') {
                problematicNode[currLevel][declaration.id.name] = node;
              }
            } else {
              const types = getTypeFromJSDocComment(node);
              if (types.length && types.includes('boolean')) {
                problematicNode[currLevel][declaration.id.name] = node;
              }
            }
          });
        }
      },
      LabeledStatement(node) {
        if (!t.isBlockStatement(node.body)) return;

        node.body.body.forEach(childNode => {
          if (!t.isExpressionStatement(childNode)) return;
          if (!t.isAssignmentExpression(childNode.expression)) return;
          if (!t.isIdentifier(childNode.expression.left)) return;

          const propName = childNode.expression.left.name;

          if (!t.isCallExpression(childNode.expression.right)) return;
          if (childNode.expression.right.callee.name !== localName) return;
          if (childNode.expression.right.arguments.length !== 1) return;

          const variable = childNode.expression.right.arguments[0];

          if (!t.isIdentifier(variable)) return;
          if (variable.name !== propName) return;

          delete problematicNode[currLevel][variable.name];
        });
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
            `Exported bool prop '${name}' must convert '' to true. $: { ${name} = ${localName}(${name}); }`
          );
        });

        if (problematicNode[codePath.id]) {
          delete problematicNode[codePath.id];
        }
      },
    };
  },
};
