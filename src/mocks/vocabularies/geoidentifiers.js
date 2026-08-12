/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * The places the tests work with.
 *
 * Every suite that touches a geographic identifier needs the same handful of
 * records out of the vocabulary answer, so the answer is read here and the
 * places are named once. Each one is in the fixture for a reason: São Paulo and
 * Zürich carry a point and are the pair a record ends up storing as a
 * `MultiPoint`, Paris is the only place with every administrative level filled
 * in, Villa Mugueta the only one with an elevation, and Springfield carries no
 * alternate names at all.
 */

import suggestions from './geoidentifiers-suggest.json';

export const SAO_PAULO = 'geonames::3448439';
export const ZURICH = 'geonames::2657896';
export const PARIS = 'geonames::2988507';
export const VILLA_MUGUETA = 'geonames::3832669';
export const SPRINGFIELD = 'geonames::9957703';

export { suggestions };

/**
 * The records the vocabulary answers a suggestion with.
 */
export const records = suggestions.hits.hits;

/**
 * The record a place is described by.
 *
 * @param {String} id Geographic identifier, as `<scheme>::<id>`.
 * @returns {Object|undefined} The vocabulary record.
 */
export const recordOf = (id) => records.find((record) => record.id === id);

/**
 * The references a record stores places as.
 *
 * A location keeps `{scheme, identifier}` and nothing else, so this is the
 * shape a test hands to anything reading a record rather than the vocabulary.
 *
 * @param {...String} ids Geographic identifiers.
 * @returns {Array.<Object>} The references.
 */
export const referencesTo = (...ids) =>
  ids.map((identifier) => ({ scheme: 'geonames', identifier }));

/**
 * The records a component holds once the references have been read back.
 *
 * @param {...String} ids Geographic identifiers.
 * @returns {Object} The records, keyed by identifier.
 */
export const recordsFor = (...ids) =>
  Object.fromEntries(ids.map((id) => [id, recordOf(id)]));
