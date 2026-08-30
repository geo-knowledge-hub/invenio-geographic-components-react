/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

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
