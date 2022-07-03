/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import _isEmpty from 'lodash/isEmpty';

import { GeometryValidator } from '../geometry';

import { i18next } from '@translations/i18next';

export const GeoJSONLoader = {
  name: 'GeoJSON',
  loader: (onImport, fileAttached) => {
    // result
    const resultData = { errors: [], data: null };

    // configuring the file reader instance
    const fileReader = new FileReader();

    fileReader.onload = function (event) {
      const loadResult = event.target.result;

      // trying to parse the loaded file
      try {
        resultData.data = JSON.parse(loadResult);
      } catch (e) {
        resultData.errors = [
          {
            message: i18next.t('Not able to parse the specified JSON file'),
          },
        ];
      }

      // only proceed if the json as parsed correctly
      if (_isEmpty(resultData)) {
        // checking the geojson loaded
        resultData.errors = GeometryValidator.validateGeoJSON(resultData.data);
      }

      onImport(resultData);
    };

    fileReader.onerror = function (event) {
      resultData.errors = [
        {
          message: i18next.t('File cannot be loaded'),
        },
      ];

      onImport(resultData);
    };

    // reading the data
    fileReader.readAsText(fileAttached);
  },
};
