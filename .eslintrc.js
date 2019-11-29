const svelteConfig = require('./svelte.config');

module.exports = {
  extends: ['@open-wc/eslint-config', 'eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  env: {
    es6: true,
    browser: true,
  },
  plugins: ['svelte3'],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'import/no-mutable-exports': 0,
      },
    },
  ],
  settings: {
    'svelte3/compiler-options': svelteConfig,
  },
};
