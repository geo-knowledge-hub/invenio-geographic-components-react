/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { SAO_PAULO_POINT, ZURICH_POINT } from '@tests/mock/spatial/points';

import { GeometryValidator, SUPPORTED_GEOMETRY_TYPES } from './validators';

describe('GeometryValidator tests', () => {
  describe('isGeometryTypeAllowed', () => {
    const allowed = (geometry, types) =>
      GeometryValidator.isGeometryTypeAllowed(geometry, types);

    it('should accept the types InvenioRDM stores', () => {
      SUPPORTED_GEOMETRY_TYPES.forEach((type) => {
        expect(allowed({ type, coordinates: [] })).toBe(true);
      });
    });

    it('should refuse the types it does not', () => {
      ['LineString', 'MultiPolygon', 'GeometryCollection'].forEach((type) => {
        expect(allowed({ type })).toBe(false);
      });
    });

    it('should accept no geometry at all', () => {
      // A location with only a place is stored without a geometry
      expect(allowed({})).toBe(true);
    });

    it('should follow the list the instance gives it', () => {
      expect(allowed({ type: 'MultiPolygon' }, ['MultiPolygon'])).toBe(true);
      expect(allowed({ type: 'Point' }, ['MultiPolygon'])).toBe(false);
    });
  });

  describe('containsGeometry', () => {
    const contains = (stored, geometry) =>
      GeometryValidator.containsGeometry(stored, geometry);

    // Define geometries for testing
    const polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [-1, -1],
          [-1, 1],
          [1, 1],
          [-1, -1],
        ],
      ],
    };

    it('should find the geometry a store holds on its own', () => {
      expect(contains(SAO_PAULO_POINT, SAO_PAULO_POINT)).toBe(true);
      expect(contains(SAO_PAULO_POINT, ZURICH_POINT)).toBe(false);
    });

    it('should find a geometry inside a multi', () => {
      // Two places are stored as one `MultiPoint`, and each of them still
      // counts as being on the map.
      const both = {
        type: 'MultiPoint',
        coordinates: [SAO_PAULO_POINT.coordinates, ZURICH_POINT.coordinates],
      };

      expect(contains(both, SAO_PAULO_POINT)).toBe(true);
      expect(contains(both, ZURICH_POINT)).toBe(true);
      expect(contains(both, { type: 'Point', coordinates: [0, 0] })).toBe(
        false
      );
    });

    it('should compare the shape, not only the type', () => {
      expect(contains(polygon, polygon)).toBe(true);
      expect(contains(polygon, SAO_PAULO_POINT)).toBe(false);
    });

    it('should hold nothing when there is nothing stored', () => {
      expect(contains({}, SAO_PAULO_POINT)).toBe(false);
      expect(contains(undefined, SAO_PAULO_POINT)).toBe(false);
    });

    it('should find nothing when there is nothing to look for', () => {
      expect(contains(SAO_PAULO_POINT, {})).toBe(false);
      expect(contains(SAO_PAULO_POINT, null)).toBe(false);
    });
  });
});
