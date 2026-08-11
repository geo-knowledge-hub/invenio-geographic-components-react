/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

import geojsonhint from '@mapbox/geojsonhint';

/**
 * Geometry types InvenioRDM stores.
 *
 * `marshmallow_utils.schemas.GeometryObjectSchema` knows these three and
 * refuses everything else on save with `Unsupported value: <type>`. The record
 * is still created and the location is still kept, only its geometry is
 * dropped
 *
 * Instances whose schema accepts more can pass their own list wherever this
 * default is used.
 */
export const SUPPORTED_GEOMETRY_TYPES = ['Point', 'MultiPoint', 'Polygon'];

/**
 * Whether a geometry object is one the instance can store.
 *
 * @param {Object} geometryObject GeoJSON Geometry object.
 * @param {Array.<String>} allowedTypes Geometry types the instance accepts.
 * @returns {Boolean}
 */
const isGeometryTypeAllowed = (
  geometryObject,
  allowedTypes = SUPPORTED_GEOMETRY_TYPES
) => {
  if (_isEmpty(geometryObject)) {
    return true;
  }

  return allowedTypes.includes(_get(geometryObject, 'type'));
};

/**
 * Validate the GeoJSON.
 *
 * @param {Object} geoJSONObject GeoJSON to be validated
 * @param {Object} options geojsonhint.hint options
 * @returns {*|Array<Object>} Array describing the errors founded in the GeoJSON.
 *
 * @see https://github.com/mapbox/geojsonhint
 */
const validateGeoJSON = (geoJSONObject, ...options) => {
  return geojsonhint.hint(geoJSONObject, options);
};

/**
 * Geometry validator.
 *
 * @type {{
 *  validateGeoJSON: (function(Object, ...[Object]): *|Array<Object>),
 *  isGeometryTypeAllowed: (function(Object, Array<String>): Boolean)
 * }}
 */
export const GeometryValidator = {
  validateGeoJSON,
  isGeometryTypeAllowed,
};
