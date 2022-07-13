/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _get from 'lodash/get';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';

/**
 * Field serializer for the `LocationsField`.
 */
export class LocationsFieldSerializer {
  constructor({ fieldpath, deserializedDefault = [], serializedDefault = [] }) {
    this.fieldpath = fieldpath;

    this.serializedDefault = serializedDefault;
    this.deserializedDefault = deserializedDefault;
  }

  /**
   * Serialize a record deserialized (in frontend format).
   *
   * @param {Object} deserialized object in front format.
   * @returns {Object} serialized object in API format.
   */
  serialize(deserialized) {
    const fieldValues = _get(
      deserialized,
      this.fieldpath,
      this.serializedDefault
    );

    // serializing the locations.
    const serializedValues = fieldValues.map((location) => {
      // transforming the identifiers
      const identifiers = _get(location, 'identifiers', []).map(
        (identifier) => ({
          scheme: identifier.scheme,
          identifier: identifier.id,
        })
      );

      return {
        ...location,
        identifiers: identifiers,
      };
    });

    if (serializedValues !== null) {
      return _set(_cloneDeep(deserialized), this.fieldpath, serializedValues);
    }
  }

  /**
   * Deserialize a record serialized (in API format).
   *
   * @param {Object} serialized object in API format.
   * @returns {Object} deserialized object in front format.
   */
  deserialize(serialized) {
    const fieldValue = _get(
      serialized,
      this.fieldpath,
      this.deserializedDefault
    );

    if (fieldValue !== null) {
      return _set(_cloneDeep(serialized), this.fieldpath, fieldValue);
    }

    return serialized;
  }
}
