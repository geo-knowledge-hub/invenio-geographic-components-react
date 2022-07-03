/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { MapContainer } from 'react-leaflet';

import { GeometryStore } from '../GeometryStore';
import { GeometryEditor } from './GeometryEditor';

import { BaseMapLayers } from '../../../../layers';

/**
 * Interactive Map Base component.
 * @constructor
 *
 * @param {GeometryStore} geometryStore Geometry Store object.
 * @param {Object} mapConfig Map Container and `GeometryEditorControl` configurations.
 */
const InteractiveMapComponent = ({ formikProps, mapConfig }) => {
  const geometryStore = new GeometryStore(formikProps);

  return (
    <MapContainer {...mapConfig.mapContainer}>
      <BaseMapLayers {...mapConfig} />
      <GeometryEditor geometryStore={geometryStore} {...mapConfig} />
    </MapContainer>
  );
};

/**
 * Interactive map used by users to visualize and edit
 * the data in the Geometry field.
 *
 * This component is never re-rendered in the React Virtual DOM. The Leaflet
 * rendering system makes all the content modification.
 *
 */
export const InteractiveMap = React.memo(
  InteractiveMapComponent,
  (props) => true // avoiding re-render
);

InteractiveMap.propTypes = {
  formikProps: PropTypes.object.isRequired,
  mapConfig: PropTypes.shape({
    mapContainer: PropTypes.object.isRequired,
    tileLayersConfig: PropTypes.object,
    geocodingConfig: PropTypes.object,
    fullscreenConfig: PropTypes.object,
    mouseCoordinateConfig: PropTypes.object,
    geometryEditorConfig: PropTypes.object,
  }),
};

InteractiveMap.defaultProps = {
  mapConfig: {
    mapContainer: {
      center: [30, -50],
      zoom: 1,
      zoomControl: true,
    },
  },
};
