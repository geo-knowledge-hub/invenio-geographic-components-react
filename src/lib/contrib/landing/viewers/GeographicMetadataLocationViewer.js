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
import _isNil from 'lodash/isNil';
import _compact from 'lodash/compact';
import _isEmpty from 'lodash/isEmpty';

import { MapContainer } from 'react-leaflet';

import { BaseMapLayers } from '../../../components/layers/base/BaseMapLayers';
import { GeoJSONLayer } from '../../../components/layers/base/GeoJSONLayer';

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
        const geometry = _get(feature, 'geometry');

        const place = _get(feature, 'place');
        const description = _get(feature, 'description');

        // A location may carry a place and no geometry at all, and InvenioRDM
        // serializes the geometry types it cannot represent with null
        // coordinates.
        // Leaflet reads their length and throws, taking the whole
        // map down with it. Neither is drawable, so neither is passed on.
        if (_isNil(geometry) || _isEmpty(_get(geometry, 'coordinates'))) {
          return null;
        }

        return {
          type: 'Feature',
          properties: {
            place,
            description,
          },
          geometry,
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
          fitBoundsOptions={mapConfig.fitBoundsOptions}
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
