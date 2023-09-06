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
 * @returns {null}
 */
export const GeoJSONLayer = ({ geoJsonData, options }) => {
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
      container.fitBounds(geometryLayerRef.current.getBounds());

      return () => {
        container.removeLayer(geometryLayerRef.current);
      };
    }
  }, [context]);

  return null;
};

GeoJSONLayer.propTypes = {
  geoJsonData: PropTypes.object,
};

GeoJSONLayer.defaultProps = {
  geoJsonData: {},
};
