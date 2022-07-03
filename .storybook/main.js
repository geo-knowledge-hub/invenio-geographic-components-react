/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-jest',
    'storybook-addon-mock/register',
  ],
  framework: '@storybook/react',
  webpackFinal: async (config, { configType }) => {
    // aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@translations/i18next': path.resolve(__dirname, '../src/lib/i18next'),
      '@tests/setup': path.resolve(__dirname, '../src/setupTests'),
      '@tests/mock': path.resolve(__dirname, '../src/mocks'),
    };

    // react-leaflet
    // see: https://stackoverflow.com/questions/70036039/react-storybook-not-running-after-installation-of-react-leaflet-version-3
    config.module.rules.push({
      test: /\.jsx?$/,
      exclude: (filename) => {
        return /node_modules/.test(filename) && !/react-leaflet/.test(filename);
      },
      loader: require.resolve('babel-loader'),
      options: {
        plugins: ['@babel/plugin-proposal-nullish-coalescing-operator'],
      },
    });

    // geojsonhint
    config.node = {
      fs: 'empty',
    };

    return config;
  },
};
