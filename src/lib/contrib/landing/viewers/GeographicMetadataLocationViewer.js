/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

import _get from 'lodash/get';
import _pick from 'lodash/pick';
import _isNil from 'lodash/isNil';
import _compact from 'lodash/compact';
import _isEmpty from 'lodash/isEmpty';

import { MapContainer } from 'react-leaflet';

import { BaseMapLayers, GeoJSONLayer } from '../../../components';

/**
 * Geographic metadata locations viewer component to visualize in an interactive map the
 * `Locations` data in an InvenioRDM Record.
 * @constructor
 *
 * @param {Array} featuresData The Locations Features objects to be visualized in the interactive map.
 * @param {Object} mapConfig Configuration object for the `BaseMapLayers`.
 * @returns {JSX.Element}
 */
export const GeographicMetadataLocationViewer = ({
  featuresData,
  mapConfig,
}) => {
  const generateFeatureCollection = (featuresData) => {
    // extracting the geometry from the features
    const featuresGeometries = _compact(
      featuresData.map((feature) => {
        const geometryData = _pick(feature, ['geometry']);

        const place = _get(feature, 'place');
        const description = _get(feature, 'description');

        if (_isNil(geometryData) || _isEmpty(geometryData)) {
          return null;
        }

        return {
          type: 'Feature',
          properties: {
            place,
            description,
          },
          ...geometryData,
        };
      })
    );

    if (!_isNil(featuresGeometries) && !_isEmpty(featuresGeometries)) {
      return {
        type: 'FeatureCollection',
        features: featuresGeometries,
      };
    }
    return null;
  };

  // generating the feature collection
  const featureCollection = generateFeatureCollection(featuresData);

  return (
    <MapContainer {...mapConfig.mapContainer}>
      <BaseMapLayers {...mapConfig} />

      {featureCollection ? (
        <GeoJSONLayer
          geoJsonData={featureCollection}
          options={{
            onEachFeature: (feature, layer) => {
              const placeText = _get(feature, 'properties.place', '');
              const descriptionText = _get(
                feature,
                'properties.description',
                ''
              );

              if (placeText || descriptionText) {
                layer.bindPopup(`
              <h4>${placeText}</h4>
              <p>${descriptionText}</p>
            `);
              } else {
                layer.bindPopup(
                  "This geometry doesn't have any extra information"
                );
              }
            },
          }}
        />
      ) : null}
    </MapContainer>
  );
};

GeographicMetadataLocationViewer.propTypes = {
  featuresData: PropTypes.array,
  mapConfig: PropTypes.object,
};

GeographicMetadataLocationViewer.defaultProps = {
  featuresData: [],
  mapConfig: {},
};
