/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import geojsonhint from '@mapbox/geojsonhint';

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
 *  validateGeoJSON: (function(Object, ...[Object]): *|Array<Object>)
 * }}
 */
export const GeometryValidator = {
  validateGeoJSON,
};
