/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Read a JSON string.
 *
 * @param {String} value The JSON string to parse.
 * @param {*} fallback The value to use when the string cannot be read.
 * @returns {*} The parsed value, or the fallback.
 */
export const parse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};
