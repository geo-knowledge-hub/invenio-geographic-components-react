/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

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
