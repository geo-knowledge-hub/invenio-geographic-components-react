/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _uniq from 'lodash/uniq';
import _map from 'lodash/map';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';

/**
 * Generate a GeoJSON Geometry Object with the type based on
 * the content of the given geometries.
 *
 * @param {Object} geometries Set of geometries.
 */
const generateGeoJSONGeometryObject = (geometries) => {
  if (!_isNil(geometries) && !_isEmpty(geometries)) {
    // serializing the features
    let geometryObjects = {};

    if (geometries.length !== 0) {
      // unique geometry type
      if (geometries.length === 1) {
        geometryObjects = geometries[0].geometry;
      } else {
        // multiple geometry types
        const geometryTypes = _uniq(_map(geometries, 'geometry.type'));

        if (geometryTypes.length === 1) {
          // multi geometries from the same type
          const geometryObjectType = geometryTypes[0];

          geometryObjects = {
            type: `Multi${geometryObjectType}`,
            coordinates: _map(geometries, 'geometry.coordinates'),
          };
        } else {
          // multiple geometries from different type
          geometryObjects = {
            type: 'GeometryCollection',
            geometries: _map(geometries, 'geometry'),
          };
        }
      }
    }
    return geometryObjects;
  }
  return geometries;
};

const generateGeometryObjectsFromFeatures = (featureData) => {
  // checking if is a feature or feature collection
  let extractedData = null;
  const featureType = _get(featureData, 'type');

  if (featureType === 'Feature') {
    extractedData = [featureData];
  } else {
    extractedData = featureData.features;
  }

  return generateGeoJSONGeometryObject(extractedData);
};

/**
 * Generate a `Feature` using the given set of geometries.
 *
 * @param {Object} geometries Set of geometries.
 * @returns {{geometry: Object, type: string, properties: {}}}
 */
const generateGeoJSONFeature = (geometries) => ({
  type: 'Feature',
  properties: {},
  geometry: geometries,
});

/**
 * Check if the given object is a Feature/FeatureCollection.
 */
const isFeatureOrFeatureCollection = (obj) => {
  const objType = _get(obj, 'type');

  return ['Feature', 'FeatureCollection'].indexOf(objType) !== -1;
};

/**
 * Geometry mutator.
 *
 * @type {{
 *  generateGeoJSONGeometryObject: (function(Object): {}),
 *  generateGeoJSONFeatures: (function(Object): {geometry: Object, type: string, properties: {}})
 * }}
 */
export const GeometryMutator = {
  generateGeoJSONGeometryObject,
  generateGeoJSONFeature,
  generateGeometryObjectsFromFeatures,
  isFeatureOrFeatureCollection,
};
