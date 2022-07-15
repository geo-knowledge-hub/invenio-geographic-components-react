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

import {
  DrawEventAssigner,
  GeometryMutator,
  isPropertyDefined,
} from '../../../base';

/**
 * Editable GeoJSONLayer.
 *
 * @param {Object} geoJsonData Leaflet.GeoJSON Object to be used as basis to create the editable layer.
 * @param {Object} eventProvider Object with the definition of the events that will be applied on the layers.
 *
 * @returns {JSX.Element}
 */
export const EditableGeoJSONLayer = ({ geoJsonData }) => {
  let leafletGeoJSONObject = null;

  if (!_isNil(geoJsonData) && !_isEmpty(geoJsonData)) {
    const mapContext = useMap();

    // creating the GeoJSON Leaflet object
    leafletGeoJSONObject = new LeafletGeoJSON(geoJsonData);

    // Adding edit/draw events for all geometries available
    // into the GeoJSON object.
    leafletGeoJSONObject.eachLayer((layer) => {
      // Exploding the geometry
      const geometriesExploded = GeometryMutator.generateGeometryExploded(
        layer.feature.geometry
      );

      // mapContext.on('layeradd', (e) => {
      //   console.log('layer just added to the map');
      //   console.log(e.layer);
      // })

      // Generating the geometry layers
      // Note: The GeoJSON can be used as a FeatureGroup, but, for the form
      // purpose we need enable users to edit each geometry individually.
      geometriesExploded.map((geometryExploded) => {
        const geojsonLayer = new LeafletGeoJSON(geometryExploded);

        geojsonLayer.options.pmIgnore = false;
        L.PM.reInitLayer(geojsonLayer);

        console.log('geojsonLayer');
        console.log(geojsonLayer);

        // Associating the events in the layer
        // DrawEventAssigner.assignLayerDrawEvents(geojsonLayer, eventProvider);

        // Adding the layer to the map
        geojsonLayer.addTo(mapContext);
      });
    });
  }

  return null;
};

EditableGeoJSONLayer.propTypes = {
  geoJsonData: PropTypes.object,
  loadCallback: PropTypes.func,
};

EditableGeoJSONLayer.defaultProps = {};
