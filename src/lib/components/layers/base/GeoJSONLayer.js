/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import _isEmpty from 'lodash/isEmpty';

import L from 'leaflet';
import { useLeafletContext } from '@react-leaflet/core';

/**
 * GeoJSON Layer. This component is used to enable us to add custom behavior
 * in the GeoJSON layer. For the other purposes, the GeoJSON from react-leaflet
 * can be used.
 * @constructor
 *
 * @param {Object} geoJsonData GeoJSON Data to be added in the Layer.
 * @param {Object} options Options for the underlying Leaflet GeoJSON layer.
 * @param {Object} fitBoundsOptions Options for the initial `fitBounds` call
 *                                  (e.g. `maxZoom`, useful for single points).
 * @returns {null}
 */
export const GeoJSONLayer = ({ geoJsonData, options, fitBoundsOptions }) => {
  const context = useLeafletContext();

  const propsRef = useRef(geoJsonData);
  const geometryLayerRef = useRef();

  useEffect(() => {
    const container = context.layerContainer || context.map;

    // getting the geometry data and creating a geometry layer
    const geometryData = propsRef.current;

    if (!_isEmpty(geometryData)) {
      geometryLayerRef.current = L.geoJSON(undefined, options).addTo(container);
      geometryLayerRef.current.addData(geometryData);

      // adjusting the map bounds
      container.fitBounds(
        geometryLayerRef.current.getBounds(),
        fitBoundsOptions
      );

      return () => {
        container.removeLayer(geometryLayerRef.current);
      };
    }
  }, [context]);

  return null;
};

GeoJSONLayer.propTypes = {
  geoJsonData: PropTypes.object,
  options: PropTypes.object,
  fitBoundsOptions: PropTypes.object,
};

GeoJSONLayer.defaultProps = {
  geoJsonData: {},
  options: {},
  fitBoundsOptions: {},
};
