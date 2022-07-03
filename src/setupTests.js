/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 *
 * Code adapted from: https://github.com/inveniosoftware/react-invenio-deposit/blob/84956cbf2e2bc28cf6a9834ecc5df37c824bd6ff/src/setupTests.js
 */

import React from 'react';
import { render } from '@testing-library/react';

import { Formik } from 'formik';
import { MapContainer } from 'react-leaflet';

// Leaflet required imports
import 'leaflet/dist/leaflet.css';

// Geocoding controller
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';

// Geometry editor
import '@geoman-io/leaflet-geoman-free';

/**
 * Wrapper for custom formik render.
 *
 * This wrapper functions generate a customizable ``Formik`` context provider
 * to be used with the ``testing-library`` ``render`` function.
 *
 * @param {Object} options object for the ``Formik`` context provider.
 *
 * @returns function callback to wrap the Rendered component.
 */
const wrapperFormikProvider =
  (options) =>
  ({ children }) =>
    <Formik {...options}>{children}</Formik>;

/**
 * Wrapper for custom Map Container render.
 *
 * This wrapper functions generate a customizable
 *           ``react-leaflet`` ``MapContainer`` context provider
 *            to be used with the ``testing-library`` ``render`` function.
 *
 * @param {Object} options object for the ``MapContainer`` context provider.
 *
 * @returns function callback to wrap the Rendered component.
 */
const wrapperLeafletMapContainerProvider =
  (options) =>
  ({ children }) =>
    <MapContainer {...options}>{children}</MapContainer>;

/**
 * Wrapper for custom Formik and Map Container render.
 *
 * @param {Object} formikOptions object for the ``Formik`` context provider.
 * @param {Object} mapContainerOptions object for the ``MapContainer`` context provider.
 * @returns function callback to wrap the Rendered component.
 */
const wrapperFormikAndLeafletContainerProvider =
  (formikOptions, mapContainerOptions) =>
  ({ children }) =>
    (
      <>
        <Formik {...formikOptions}>
          <MapContainer {...mapContainerOptions}>{children}</MapContainer>
        </Formik>
      </>
    );

/**
 * @name customFormikRender
 * @description Custom render method for the ``testing-library``
 */
const customFormikRender = (ui, formikOptions = {}, renderOptions = {}) =>
  render(ui, {
    wrapper: wrapperFormikProvider(formikOptions),
    ...renderOptions,
  });

/**
 * @name customMapContainerRender
 * @description Custom render method for the ``testing-library``
 */
const customMapContainerRender = (
  ui,
  mapContainerOptions = {},
  renderOptions = {}
) =>
  render(ui, {
    wrapper: wrapperLeafletMapContainerProvider(mapContainerOptions),
    ...renderOptions,
  });

/**
 * Custom render with MapContainer and Formik providers.
 */
const customFormikAndMapContainerRender = (
  ui,
  formikOptions,
  mapContainerOptions = {},
  renderOptions = {}
) =>
  render(ui, {
    wrapper: wrapperFormikAndLeafletContainerProvider(
      formikOptions,
      mapContainerOptions
    ),
    ...renderOptions,
  });

export * from '@testing-library/react';
export {
  render as render,
  customFormikRender as renderWithFormikProvider,
  customMapContainerRender as renderWithMapContainer,
  customFormikAndMapContainerRender as renderWithFormikAndMapContainer,
};
