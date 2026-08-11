/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import './viewer.css';

import { GeographicMetadataLocationViewer } from '../lib/contrib/landing/viewers';

/**
 * Parse a JSON string
 *
 * @param {string} value - The JSON string to parse
 * @param {any} fallback - The fallback value if the JSON string is invalid
 *
 * @returns {any} The parsed value
 */
const parse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

/**
 * Render the map into a single container element
 *
 * @param {HTMLElement} element - The container element
 */
export const mount = (element) => {
  const features = parse(element.dataset.features, []);

  if (!features.length) {
    return;
  }

  ReactDOM.render(
    <GeographicMetadataLocationViewer
      featuresData={features}
      mapConfig={parse(element.dataset.mapConfig, {})}
    />,
    element
  );
};

/**
 * Mount all the maps on the page
 */
const mountAll = () =>
  document.querySelectorAll('[data-invenio-locations-map]').forEach(mount);

/**
 * Mount all the maps on the page
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAll);
} else {
  mountAll();
}
