const svelteConfig = { customElement: true };

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
      'warn',
      {
        devDependencies: [
          '**/*.test.js',
          '**/*.spec.js',
          'script/*.js',
          'eslint-plugin-min-butik/*.js',
          '*.js',
        ],
      },
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
        'min-butik/problematic-boolean': 1,
      },
    },
  ],
  settings: {
    'svelte3/compiler-options': svelteConfig,
    'svelte3/ignore-styles': attr => attr.lang,
  },
};
