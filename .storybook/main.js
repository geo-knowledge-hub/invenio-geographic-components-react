/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

const path = require('path');
const webpack = require('webpack');

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-jest',
    'storybook-addon-mock',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
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

    // tinymce
    // `react-invenio-forms` pulls in the rich text editor and its plugins, and
    // TinyMCE is not a dependency here. None of these components use it, so it
    // is stubbed the same way the jest suites stub it (`moduleNameMapper`).
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^tinymce(\/.*)?$|^@tinymce\/tinymce-react$/,
        path.resolve(__dirname, '../src/mocks/tinymce.js')
      )
    );

    // geojsonhint - provide fallback for 'fs' (webpack 5)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
};
