const svelteConfig = require('./svelte.config');

const svelteCompilerOptions = Object.assign({}, svelteConfig);
delete svelteCompilerOptions.preprocess;

module.exports = {
  extends: ['@open-wc/eslint-config', 'eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  rules: {
    'no-use-before-define': ['error', 'nofunc'],
    'import/extensions': ['error', 'always', { js: 'never' }],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.js', '**/*.spec.js', 'script/*.js', '*.js'] },
    ],
  },
  plugins: ['svelte3', 'min-butik'],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'import/no-mutable-exports': 0,
        'min-butik/force-lower-export': 1,
      },
    },
  ],
  settings: {
    'svelte3/compiler-options': svelteCompilerOptions,
    'svelte3/ignore-styles': attr => attr.lang,
  },
};
