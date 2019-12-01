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
  rules: {
    'no-use-before-define': ['error', 'nofunc'],
    'import/extensions': ['error', 'always', { js: 'never' }],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.js', '**/*.spec.js', , 'script/*.js'] },
    ],
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
