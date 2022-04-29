/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import { useEffect, useRef } from 'react';

import _ from 'lodash';

import PropTypes from 'prop-types';

import L from 'leaflet';
import { useLeafletContext } from '@react-leaflet/core';

import { MapContainer, TileLayer } from 'react-leaflet';

/**
 * GeoJSONGeometry
 *
 * @summary GeoJSON Geometry representation component to use
 * into the ``InteractiveMap``.
 */
const GeoJSONGeometry = (props) => {
  const context = useLeafletContext();

  const propsRef = useRef(props);
  const geometryLayerRef = useRef();

  useEffect(() => {
    const container = context.layerContainer || context.map;

    // getting the geometry data and creating a geometry layer
    const geometryData = propsRef.current.geometryData;

    if (!_.isEmpty(geometryData)) {
      geometryLayerRef.current = L.geoJSON().addTo(container);
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

/**
 * InteractiveMap
 *
 * @summary Interactive map component.
 *
 */
export const InteractiveMap = ({ mapContainerOptions, geoJSONData }) => {
  return (
    <MapContainer {...mapContainerOptions}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <GeoJSONGeometry geometryData={geoJSONData} />
    </MapContainer>
  );
};

InteractiveMap.propTypes = {
  geoJSONData: PropTypes.object,
  mapContainerOptions: PropTypes.object,
};

InteractiveMap.defaultProps = {
  geoJSONData: null,
  mapContainerOptions: {
    id: 'map-container',
    scrollWheelZoom: false,
  },
};
