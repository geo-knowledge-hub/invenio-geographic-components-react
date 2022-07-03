/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Dropdown } from 'semantic-ui-react';

import { GeoJSONLoader, WebFeatureServiceLoader } from './loaders';
import { i18next } from '@translations/i18next';

/**
 * Geometry loader.
 * @constructor
 *
 * @param {Function} uploadCallback Function called when the data is loaded.
 * @param {Object} dropdownConfig Configuration for the Semantic-UI Dropdown used to represent the loader.
 * @returns {JSX.Element}
 */
export const GeometryLoader = ({ uploadCallback, dropdownConfig }) => (
  <>
    <Dropdown {...dropdownConfig}>
      <Dropdown.Menu>
        <Dropdown.Header
          icon={'arrow alternate circle right outline'}
          content={i18next.t('Import from')}
        />

        <GeoJSONLoader onImport={uploadCallback} />
        <WebFeatureServiceLoader onImport={uploadCallback} />
      </Dropdown.Menu>
    </Dropdown>
  </>
);

GeometryLoader.propTypes = {
  uploadCallback: PropTypes.func.isRequired,
  dropdownConfig: PropTypes.object,
};

GeometryLoader.defaultProps = {};
