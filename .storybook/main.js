const path = require('path');
const svelteOptions = require('../svelte.config');

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: ['@storybook/addon-essentials'],
  webpackFinal: async config => {
    Object.assign(config.resolve.alias, {
      svelte: path.resolve('node_modules', 'svelte'),
    });

    config.resolve.extensions.push('.svelte');

    config.module.rules.push({
      test: /\.(html|svelte)$/,
      exclude: /node_modules/,
      use: {
        loader: 'svelte-loader',
        options: Object.assign({}, svelteOptions, {
          dev: true,
        }),
      },
    });

    return config;
  },
};
