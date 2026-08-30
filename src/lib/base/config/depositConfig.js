/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import { parse } from './json';

/**
 * Element the instance renders its deposit form configuration into.
 *
 * @type String
 */
export const DEPOSIT_CONFIG_ELEMENT_ID =
  'invenio-geographic-components-deposit-config';

/**
 * Read the configuration the instance rendered into the deposit page.
 *
 * The landing page is given its configuration through data attributes, but the
 * deposit form is mounted from an override the instance writes itself, with no
 * template of its own to carry one. This reads the same configuration from a
 * script tag, so that a single `invenio.cfg` drives both pages.
 *
 * The object holds `mapConfig`, from `GEOGRAPHIC_COMPONENTS_MAP_CONFIG`, and
 * `identifiersApiUrl`, from `GEOGRAPHIC_COMPONENTS_IDENTIFIERS_API_URL`.
 *
 * An instance that has not installed the template gets an empty object, and the
 * components fall back to their own defaults.
 *
 * @param {String} elementId Element holding the configuration.
 * @returns {Object} The configuration, or an empty object.
 */
export const readDepositConfig = (elementId = DEPOSIT_CONFIG_ELEMENT_ID) =>
  parse(document.getElementById(elementId)?.textContent, {});
