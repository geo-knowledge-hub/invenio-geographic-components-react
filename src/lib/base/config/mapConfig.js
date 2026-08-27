/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import { parse } from './json';

/**
 * Element the instance renders its map configuration into.
 *
 * @type String
 */
export const MAP_CONFIG_ELEMENT_ID = 'invenio-geographic-components-map-config';

/**
 * Read the map configuration the instance rendered into the page.
 *
 * The landing page map is given its configuration through a data attribute, but
 * the deposit form is mounted from an override the instance writes itself, with
 * no template of its own to carry one. This reads the same configuration from a
 * script tag, so that a single `GEOGRAPHIC_COMPONENTS_MAP_CONFIG` can drive both
 * maps.
 *
 * An instance that has not installed the template gets an empty object, and the
 * components fall back to their own defaults.
 *
 * @param {String} elementId Element holding the configuration.
 * @returns {Object} The configuration, or an empty object.
 */
export const readMapConfig = (elementId = MAP_CONFIG_ELEMENT_ID) =>
  parse(document.getElementById(elementId)?.textContent, {});

/**
 * Put a watermark position into a map configuration.
 *
 * Components take the position as a property of their own, next to the map
 * configuration they pass along. This folds the one into the other, so that
 * everything below reads a single object.
 *
 * @param {Object} mapConfig Map configuration.
 * @param {String|null|undefined} watermarkPosition Corner the watermark is put
 *                                                  in. Left out, the map
 *                                                  configuration is untouched.
 * @returns {Object} The map configuration.
 */
export const withWatermarkPosition = (mapConfig = {}, watermarkPosition) =>
  watermarkPosition === undefined
    ? mapConfig
    : { ...mapConfig, watermarkPosition };
