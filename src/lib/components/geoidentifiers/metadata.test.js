/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import {
  PARIS,
  SAO_PAULO,
  SPRINGFIELD,
  VILLA_MUGUETA,
  ZURICH,
  recordOf,
} from '@tests/mock/vocabularies/geoidentifiers';

import {
  alternateNamesOf,
  describe as describeRecord,
  detailsOf,
  geometryOf,
  summarize,
} from './metadata';

const labelled = (record, label) => {
  return (detailsOf(record).find((row) => row.label === label) || {}).value;
};

describe('Geographic identifiers metadata tests', () => {
  describe('summarize', () => {
    it('should read the values that tell two places apart', () => {
      expect(summarize(recordOf(SAO_PAULO))).toEqual({
        id: SAO_PAULO,
        name: 'São Paulo',
        scheme: 'geonames',
        country: 'Brazil',
        division: 'São Paulo',
        feature: 'seat of a first-order administrative division',
        population: (12400232).toLocaleString(),
        coordinates: '-23.5475, -46.63611',
        geometryType: 'Point',
      });
    });

    it('should read latitude first, as a reader expects', () => {
      // Validate the geometry
      expect(geometryOf(recordOf(ZURICH)).coordinates).toEqual([
        8.55, 47.36667,
      ]);

      // Validate the coordinates
      expect(summarize(recordOf(ZURICH)).coordinates).toBe('47.36667, 8.55');
    });

    it('should hold nothing for a record that is not one', () => {
      // Validate the summarize
      expect(summarize({})).toEqual({
        id: null,
        name: null,
        scheme: null,
        country: null,
        division: null,
        feature: null,
        population: null,
        coordinates: null,
        geometryType: null,
      });
    });

    it('should not offer coordinates for a geometry that has no single point', () => {
      const record = {
        locations: [{ geometry: { type: 'Polygon', coordinates: [[]] } }],
      };

      // Validate the summarize
      expect(summarize(record).coordinates).toBeNull();
      expect(summarize(record).geometryType).toBe('Polygon');
    });
  });

  describe('describe', () => {
    it('should place a record in one line', () => {
      // Validate the describe
      expect(describeRecord(recordOf(PARIS))).toBe(
        'France · Île-de-France · capital of a political entity'
      );
    });

    it('should join only what the record has', () => {
      // Validate the describe
      expect(describeRecord({ extras: { country: { name: 'Brazil' } } })).toBe(
        'Brazil'
      );

      expect(describeRecord({})).toBe('');
    });
  });

  describe('geometryOf', () => {
    it('should read the geometry a record locates itself with', () => {
      // Validate the geometry
      expect(geometryOf(recordOf(SPRINGFIELD))).toEqual({
        type: 'Point',
        coordinates: [152.91716, -27.65365],
      });
    });

    it('should hold nothing when there is no location', () => {
      expect(geometryOf({})).toBeNull();
      expect(geometryOf({ locations: [] })).toBeNull();
    });
  });

  describe('alternateNamesOf', () => {
    it('should read the names a place is also known by', () => {
      expect(alternateNamesOf(recordOf(SAO_PAULO))).toContain('Sampa');
    });

    it('should be empty for a record that carries none', () => {
      expect(alternateNamesOf(recordOf(SPRINGFIELD))).toEqual([]);
    });
  });

  describe('detailsOf', () => {
    it('should lay out every administrative level the record has', () => {
      expect(labelled(recordOf(PARIS), 'Administrative division 1')).toBe(
        'Île-de-France (11)'
      );

      // Only the first level is resolved to a name. The rest keep their code.
      expect(labelled(recordOf(PARIS), 'Administrative division 4')).toBe(
        '75056'
      );

      // Validate the administrative division 2
      expect(labelled(recordOf(SAO_PAULO), 'Administrative division 2')).toBe(
        undefined
      );
    });

    it('should keep the ascii name only when it is another name', () => {
      expect(labelled(recordOf(ZURICH), 'ASCII name')).toBe('Zuerich');
      expect(labelled(recordOf(PARIS), 'ASCII name')).toBe(undefined);
    });

    it('should show the elevation the few records that have one carry', () => {
      expect(labelled(recordOf(VILLA_MUGUETA), 'Elevation')).toBe('85');
      expect(labelled(recordOf(SAO_PAULO), 'Elevation')).toBe(undefined);
      expect(labelled(recordOf(SAO_PAULO), 'Elevation (digital model)')).toBe(
        '769'
      );
    });

    it('should name the country and the feature with their codes', () => {
      expect(labelled(recordOf(SAO_PAULO), 'Country')).toBe('Brazil (BR)');
      expect(labelled(recordOf(SAO_PAULO), 'Official name')).toBe(
        'Federative Republic of Brazil'
      );
      expect(labelled(recordOf(SPRINGFIELD), 'Feature code')).toBe(
        'section of populated place (PPLX)'
      );
    });

    it('should leave out every value the record does not have', () => {
      const rows = detailsOf({ id: 'geonames::1', name: 'Somewhere' });

      expect(rows).toEqual([
        { label: 'Name', value: 'Somewhere' },
        { label: 'Identifier', value: 'geonames::1' },
      ]);
    });
  });
});
