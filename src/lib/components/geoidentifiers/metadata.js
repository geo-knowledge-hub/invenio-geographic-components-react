/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import _compact from 'lodash/compact';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';

import { i18next } from '@translations/i18next';

/**
 * The administrative levels of a record.
 */
const ADMIN_LEVELS = ['level1', 'level2', 'level3', 'level4'];

/**
 * Format a number for reading.
 *
 * @param {Number} value Number to be formatted.
 * @returns {String|null} Grouped number, or `null` when there is none.
 */
const formatNumber = (value) => {
  return _isNil(value) ? null : Number(value).toLocaleString();
};

/**
 * Format a geometry as the coordinates a reader expects.
 *
 * GeoJSON orders a position longitude first. People read latitude first, so the
 * pair is swapped. Only a `Point` has a single position to show.
 *
 * @param {Object} geometry GeoJSON Geometry object.
 * @returns {String|null} `latitude, longitude`, or `null` for any other type.
 */
const formatCoordinates = (geometry) => {
  if (_get(geometry, 'type') !== 'Point') {
    return null;
  }

  // Get the coordinates
  const [longitude, latitude] = _get(geometry, 'coordinates', []);

  // Check if the coordinates are nil
  const isNil = _isNil(latitude) || _isNil(longitude);

  // Format the coordinates
  const result = isNil ? null : `${latitude}, ${longitude}`;

  // Return the result
  return result;
};

/**
 * Get the geometry a record locates itself with.
 *
 * @param {Object} record Geographic Identifiers record.
 * @returns {Object|null} GeoJSON Geometry object, or `null` when the record has none.
 */
export const geometryOf = (record) => {
  return _get(record, 'locations[0].geometry') || null;
};

/**
 * Get the names a place is also known by.
 *
 * @param {Object} record Geographic Identifiers record.
 * @returns {Array.<String>} Alternate names, empty when the record has none.
 */
export const alternateNamesOf = (record) => {
  return _get(record, 'extras.alternate_names', []);
};

/**
 * Summarize a record into the few values that tell two places apart.
 *
 * @param {Object} record Geographic Identifiers record.
 * @returns {Object} Summary, with `null` for whatever the record does not have.
 */
export const summarize = (record) => {
  const geometry = geometryOf(record);

  return {
    id: _get(record, 'id', null),
    name: _get(record, 'name', null),
    scheme: _get(record, 'scheme', null),
    country: _get(record, 'extras.country.name', null),
    division: _get(record, 'extras.admin.level1.name', null),
    feature: _get(record, 'extras.feature.name', null),
    population: formatNumber(_get(record, 'extras.population')),
    coordinates: formatCoordinates(geometry),
    geometryType: _get(geometry, 'type', null),
  };
};

/**
 * The place a record sits in, as one line.
 *
 * @param {Object} record Geographic Identifiers record.
 * @returns {String} Country, division and feature, dropping what is missing.
 */
export const describe = (record) => {
  const { country, division, feature } = summarize(record);

  return _compact([country, division, feature]).join(' · ');
};

/**
 * Everything a record holds, as labelled rows.
 *
 * @param {Object} record Geographic Identifiers record.
 * @returns {Array.<Object>} `{ label, value }` rows, without the empty ones.
 */
export const detailsOf = (record) => {
  // Get metadata from the record
  const extras = _get(record, 'extras', {});
  const asciiName = _get(extras, 'ascii_name');
  const country = _get(extras, 'country', {});
  const feature = _get(extras, 'feature', {});

  // Get the divisions
  const divisions = ADMIN_LEVELS.map((level) => {
    const division = _get(extras, `admin.${level}`);

    if (!division) {
      return null;
    }

    const { name, code } = division;

    return {
      label: i18next.t('Administrative division {{level}}', {
        level: level.replace('level', ''),
      }),
      value: name ? `${name} (${code})` : code,
    };
  });

  const rows = [
    { label: i18next.t('Name'), value: _get(record, 'name') },
    {
      label: i18next.t('ASCII name'),
      value: asciiName === _get(record, 'name') ? null : asciiName,
    },
    { label: i18next.t('Scheme'), value: _get(record, 'scheme') },
    { label: i18next.t('Identifier'), value: _get(record, 'id') },
    {
      label: i18next.t('Country'),
      value: country.name && `${country.name} (${country.code})`,
    },
    { label: i18next.t('Official name'), value: country.official_name },
    ...divisions,
    {
      label: i18next.t('Feature class'),
      value: feature.class_name && `${feature.class_name} (${feature.class})`,
    },
    {
      label: i18next.t('Feature code'),
      value: feature.name && `${feature.name} (${feature.code})`,
    },
    {
      label: i18next.t('Population'),
      value: formatNumber(_get(extras, 'population')),
    },
    {
      label: i18next.t('Elevation'),
      value: formatNumber(_get(extras, 'elevation')),
    },
    {
      label: i18next.t('Elevation (digital model)'),
      value: formatNumber(_get(extras, 'dem')),
    },
    { label: i18next.t('Timezone'), value: _get(extras, 'timezone') },
    {
      label: i18next.t('Coordinates'),
      value: formatCoordinates(geometryOf(record)),
    },
    { label: i18next.t('Last modified'), value: _get(extras, 'modified') },
  ];

  return rows.filter((row) => row && row.value);
};
