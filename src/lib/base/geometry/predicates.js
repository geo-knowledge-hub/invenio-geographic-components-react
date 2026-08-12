/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';

import { GeometryMutator } from './mutators';

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
export const isGeometryTypeAllowed = (
  geometryObject,
  allowedTypes = SUPPORTED_GEOMETRY_TYPES
) => {
  if (_isEmpty(geometryObject)) {
    return true;
  }

  return allowedTypes.includes(_get(geometryObject, 'type'));
};

/**
 * Whether a geometry is already part of a stored one.
 *
 * A stored value is one geometry, so two of the same type are kept as a
 * `Multi...` and the question "is this place on the map already?" cannot be
 * asked of it directly. It is exploded back into the geometries it was built
 * from, and the candidate is looked for among them.
 *
 * @param {Object} storedGeometry GeoJSON Geometry object holding what is stored.
 * @param {Object} geometry GeoJSON Geometry object to look for.
 * @returns {Boolean}
 */
export const containsGeometry = (storedGeometry, geometry) => {
  if (_isEmpty(storedGeometry) || _isEmpty(geometry)) {
    return false;
  }

  return GeometryMutator.generateGeometryExploded(storedGeometry).some(
    (feature) => _isEqual(feature.geometry, geometry)
  );
};
