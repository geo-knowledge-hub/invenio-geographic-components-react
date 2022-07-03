/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import * as turfConvex from '@turf/convex';
import * as turfCentroid from '@turf/centroid';

import * as turfBoundingBox from '@turf/bbox';
import * as turfBoundingBoxPolygon from '@turf/bbox-polygon';

/**
 * Takes one or more features and calculates the centroid using
 * the mean of all vertices. Facade created to avoid modification
 * in the code if the base library changes.
 *
 * @param {Object} geoJson geoJson `Feature` or `FeatureCollection` used in the operation
 * @param {Object} options Turf.js Centroid operation options.
 * @returns {Feature<Point>}
 *
 * @see https://turfjs.org/docs/#centroid
 */
const centroid = (geoJson, ...options) =>
  turfCentroid.default(geoJson, options);

/**
 * Calculates the Convex Hull of the Feature or FeatureCollection.
 * Facade created to avoid modification in the code if the base library changes.
 *
 * @param {Object} geoJson geoJson `Feature` or `FeatureCollection` used in the operation
 * @param {Object} options Turf.js convex operation options.
 * @returns {Feature<Polygon>, FeatureCollection<Polygon>}
 *
 * @see https://turfjs.org/docs/#convex
 */
const convexHull = (geoJson, ...options) =>
  turfConvex.default(geoJson, options);

/**
 * Calculates the Bounding box of a Feature or FeatureCollection.
 * Facade created to avoid modification in the code if the base library changes.
 *
 * @param {Object} geoJson geoJson `Feature` or `FeatureCollection` used in the operation
 * @param {Object} options Turf.js bbox-polygon operation options.
 * @returns {Feature<Polygon>, FeatureCollection<Polygon>}
 *
 * @see https://turfjs.org/docs/#bbox
 * @see https://turfjs.org/docs/#bboxPolygon
 */
const boundingBox = (geoJson, ...options) =>
  turfBoundingBoxPolygon.default(turfBoundingBox.default(geoJson), options);

/**
 * Geometry operations.
 *
 * @type {{
 *  boundingBox: (function(Object, ...[Object]): *),
 *  centroid: (function(Object, ...[Object]): Feature<Point>),
 *  convexHull: (function(Object, ...[Object]): Feature<Polygon>)
 * }}
 */
export const GeometryOperator = {
  centroid,
  convexHull,
  boundingBox,
};
