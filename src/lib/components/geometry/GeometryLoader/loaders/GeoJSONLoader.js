/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

import _isNil from 'lodash/isNil';

import { Dropdown } from 'semantic-ui-react';

import { GeometryLoader } from '../../../../base';
import { i18next } from '@translations/i18next';

/**
 * GeoJSON Loader.
 * @constructor
 *
 * @param {Function} onImport Function called after the data is loaded.
 * @param {Object} dropdownItemConfig Options to configure the Semantic-ui
 * Dropdown.Item generated for this loader.
 *
 * @returns {JSX.Element}
 *
 * @see https://react.semantic-ui.com/modules/dropdown/
 */
export const GeoJSONLoader = ({ onImport, dropdownItemConfig }) => {
  const handleFileDefinition = (e) => {
    const files = e.target.files;
    const resultData = { errors: [], data: null };

    if (files.length === 1) {
      const fileAttached = files[0];

      if (!_isNil(fileAttached)) {
        GeometryLoader.GeoJSONLoader.loader(onImport, fileAttached);
      }
    } else {
      resultData.errors = [
        {
          message: i18next.t('You can specify only one file at a time'),
        },
      ];

      onImport(resultData);
    }
  };

  return (
    <>
      <input
        type={'file'}
        id={'geojson-file-input'}
        onChange={handleFileDefinition}
        hidden={true}
      />

      <Dropdown.Item
        onClick={(e) => {
          document.getElementById('geojson-file-input').click();
        }}
        {...dropdownItemConfig}
      >
        {i18next.t('GeoJSON file')}
      </Dropdown.Item>
    </>
  );
};

GeoJSONLoader.propTypes = {
  onImport: PropTypes.func.isRequired,
  dropdownItemConfig: PropTypes.object,
};

GeoJSONLoader.defaultProps = {};
