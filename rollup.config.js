/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Build configuration
 *
 * Two bundles are produced, both written into the Python package so that a
 * `pip install` ships working JavaScript:
 *
 * - `viewer`: self-contained IIFE for the record landing page. Loaded by a
 *   `<script>` tag, so it bundles React and the whole Leaflet stack.
 * - `lib`: ES module with the deposit form fields, consumed through the
 *   `@js/invenio_geographic_components` webpack alias. Dependencies already
 *   present in an InvenioRDM instance stay external; the rest is bundled so
 *   instances do not need to install anything.
 */

import path from 'path';

import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import url from '@rollup/plugin-url';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';
import postcssUrl from 'postcss-url';
import { terser } from 'rollup-plugin-terser';

/** 
 * The Python distribution lives under `python/`, and 
 * the JavaScript at the root.
 */
const PYTHON_DIR = 'python';
const PYTHON_PACKAGE = 'invenio_geographic_components';

/**
 * Resolve static directory
 */
const STATIC_DIR = path.resolve(
  __dirname,
  PYTHON_DIR,
  PYTHON_PACKAGE,
  'static',
  PYTHON_PACKAGE
);

/**
 * Resolve assets directory
 */
const ASSETS_DIR = path.resolve(
  __dirname,
  PYTHON_DIR,
  PYTHON_PACKAGE,
  'assets/semantic-ui/js',
  PYTHON_PACKAGE
);

/** 
 * Dependencies InvenioRDM already provides
 */
const INVENIO_PROVIDED = [
  'react',
  'react-dom',
  'prop-types',
  'formik',
  'semantic-ui-react',
  'react-invenio-forms',
  'react-dnd',
  'react-dnd-html5-backend',
  'axios',
  'query-string',
  'i18next',
  'react-i18next',
  'i18next-browser-languagedetector',
];

/**
 * `@mapbox/geojsonhint` embeds a JSON parser that keeps its command line entry
 * point, which reads files from disk. That code never runs in a browser, but
 * webpack would still fail to resolve `fs` and `path`.
 */
const stubNodeBuiltins = () => {
  const stubbed = ['fs', 'path'];

  return {
    name: 'stub-node-builtins',
    resolveId: (id) => (stubbed.includes(id) ? id : null),
    load: (id) => (stubbed.includes(id) ? 'export default {};' : null),
  };
};

/**
 * Turns the linter off for the generated file. A plain header is not enough:
 * bundled dependencies bring their own `eslint-enable` comments, which would
 * switch it back on halfway through and fail the build of the instance.
 */
const disableEslint = () => ({
  name: 'disable-eslint',
  renderChunk: (code) => ({
    code:
      '/* eslint-disable */\n' +
      code
        .replace(/\/\*\s*eslint[\s\S]*?\*\//g, '')
        .replace(/\/\/\s*eslint-[^\n]*/g, ''),
    map: null,
  }),
});

const basePlugins = (cssFile) => [
  stubNodeBuiltins(),
  alias({
    entries: {
      '@translations/i18next': path.resolve(__dirname, 'src/lib/i18next'),
    },
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
    preventAssignment: true,
  }),
  // Leaflet ships its marker icons as files. Inline them so there are no
  // asset paths to resolve at runtime
  url({ include: ['**/*.png', '**/*.svg'], limit: Infinity }),
  postcss({
    extract: cssFile,
    // `minimize` would run cssnano as a second pass over the *stringified*
    // CSS. `postcss-url` escapes `<!--` as `\3c !--` when it stringifies, so
    // on that second pass svgo no longer recognises the comments in the
    // Geoman icons, keeps them as character data and escapes their `-->` to
    // `--&gt;` leaving every Sketch-exported icon an unterminated comment,
    // and the toolbar button blank. Running cssnano as a plugin keeps it on
    // the same AST as `postcss-url`, where the comments are still comments
    minimize: false,
    plugins: [
      // Inline the images referenced by the vendor stylesheets, so a single
      // CSS file is all there is to ship
      postcssUrl({ url: 'inline' }),
      cssnano(),
    ],
  }),
  nodeResolve({ browser: true, preferBuiltins: false }),
  // Babel runs before commonjs so that JSX is gone 
  // by the time commonjs parses
  babel({
    babelrc: false,
    configFile: false,
    babelHelpers: 'bundled',
    extensions: ['.js', '.jsx'],
    // react-leaflet 3.x publishes untranspiled modern syntax
    exclude: [/node_modules\/(?!(react-leaflet|@react-leaflet)\/)/],
    presets: [
      ['@babel/preset-env', { bugfixes: true }],
      ['@babel/preset-react', { runtime: 'classic' }],
    ],
  }),
  commonjs(),
  json(),
];

const viewer = {
  input: 'src/viewer/index.js',
  output: {
    file: path.join(STATIC_DIR, 'locations-viewer.js'),
    format: 'iife',
    name: 'InvenioGeographicComponents',
    sourcemap: false,
  },
  plugins: [
    ...basePlugins(path.join(STATIC_DIR, 'locations-viewer.css')),
    terser(),
  ],
};

const lib = {
  input: 'src/lib/index.js',
  output: {
    file: path.join(ASSETS_DIR, 'index.js'),
    format: 'esm',
    sourcemap: false,
  },
  external: (id) => INVENIO_PROVIDED.includes(id) || /^lodash(\/|$)/.test(id),
  plugins: [
    ...basePlugins(path.join(ASSETS_DIR, 'index.css')),
    disableEslint(),
  ],
};

export default [viewer, lib];
