/**
 * @fileoverview Rule to disallow camelCase exports
 * @author Pontus Lundin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',

    docs: {
      description: 'disallow mixed case exports',
      category: 'Possible Errors',
      recommended: true,
      url: '',
    },
    fixable: 'code',
    schema: [], // no options
  },
  create(context) {
    const allLowerCase = /^[a-z]+$/;
    return {
      ExportNamedDeclaration(node) {
        if (node.declaration == null) return;

        const { type, kind, declarations } = node.declaration;

        if (type === 'VariableDeclaration' && kind === 'let') {
          declarations.forEach(declaration => {
            if (allLowerCase.test(declaration.id.name)) return;
            context.report(
              node,
              `Exported properties (${declaration.id.name}) must be in lowercase or it won't work in the DOM`
            );
          });
        }
      },
    };
  },
};
