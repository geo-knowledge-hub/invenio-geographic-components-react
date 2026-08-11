/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

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
});
