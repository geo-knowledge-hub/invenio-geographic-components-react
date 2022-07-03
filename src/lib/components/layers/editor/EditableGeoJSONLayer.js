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
import _isEmpty from 'lodash/isEmpty';

import { useMap } from 'react-leaflet';
import L, { GeoJSON as LeafletGeoJSON } from 'leaflet';

import { DrawEventAssigner } from '../../../base';

/**
 * Editable GeoJSONLayer.
 *
 * @param {Object} geoJsonData Leaflet.GeoJSON Object to be used as basis to create the editable layer.
 * @param {Object} eventProvider Object with the definition of the events that will be applied on the layers.
 *
 * @returns {JSX.Element}
 */
export const EditableGeoJSONLayer = ({ geoJsonData, eventProvider }) => {
  let leafletGeoJSONObject = null;

  if (!_isNil(geoJsonData) && !_isEmpty(geoJsonData)) {
    const mapContext = useMap();

    // creating the GeoJSON Leaflet object
    leafletGeoJSONObject = new LeafletGeoJSON(geoJsonData);

    // Adding edit/draw events for all geometries available
    // into the GeoJSON object.
    leafletGeoJSONObject.eachLayer((layer) => {
      DrawEventAssigner.assignLayerDrawEvents(layer, eventProvider);

      // adding to the map
      // this is ok! the map is not rendered by React
      layer.addTo(mapContext);
    });
  }

  return null;
};

EditableGeoJSONLayer.propTypes = {
  geoJsonData: PropTypes.object,
  loadCallback: PropTypes.func,
};

EditableGeoJSONLayer.defaultProps = {};
