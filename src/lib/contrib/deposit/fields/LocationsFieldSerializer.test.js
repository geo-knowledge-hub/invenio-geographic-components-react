/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { SAO_PAULO, records } from '@tests/mock/vocabularies/geoidentifiers';

import { LocationsFieldSerializer } from './LocationsFieldSerializer';

const locationsField = new LocationsFieldSerializer({
  fieldpath: 'metadata.locations.features',
});

const defaultDeserializedObject = {
  metadata: {
    locations: {
      features: [
        {
          place: 'place name',
          description: 'place description',
          identifiers: [
            {
              id: 'geonames::1234',
              key: 'key value',
              name: 'name',
              scheme: 'geonames',
              text: 'text',
              value: 'value',
            },
          ],
        },
      ],
    },
  },
};

const defaultSerializedObject = {
  metadata: {
    locations: {
      features: [
        {
          place: 'place name',
          description: 'place description',
          identifiers: [
            {
              identifier: 'geonames::1234',
              scheme: 'geonames',
            },
          ],
        },
      ],
    },
  },
};

describe('LocationsFieldSerializer tests', () => {
  describe('Serialization tests', () => {
    it('should serialize an Location object', () => {
      const serializedObject = locationsField.serialize(
        defaultDeserializedObject
      );
      expect(serializedObject).toEqual(defaultSerializedObject);
    });

    it('should keep the vocabulary metadata out of the record', () => {
      // An InvenioRDM location identifier is `{ scheme, identifier }` and
      // nothing else. The record schema answers every other key with
      // "Unknown field". The `GeographicIdentifiersField` no longer puts anything
      // else in the form, but a whole vocabulary record reaching here from
      // somewhere older must still come out as a reference.
      const [record] = records;

      // Serialize the record
      const serialized = locationsField.serialize({
        metadata: { locations: { features: [{ identifiers: [record] }] } },
      });

      // Validate the serialized record
      expect(serialized.metadata.locations.features[0].identifiers).toEqual([
        { identifier: SAO_PAULO, scheme: 'geonames' },
      ]);
    });
  });

  describe('Deserialization tests', () => {
    it('should deserialize an Location object', () => {
      const deserializedObject = locationsField.deserialize(
        defaultSerializedObject
      );
      expect(deserializedObject).toEqual(defaultSerializedObject);
    });
  });
});
