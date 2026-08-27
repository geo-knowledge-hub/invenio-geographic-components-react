/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { Field } from 'formik';

import { InteractiveMap } from './InteractiveMap';
import { renderWithFormikProvider } from '@tests/setup';

import { GeometryStore } from '../GeometryStore';

/**
 * Render the map over a configuration.
 */
const renderMap = (mapConfig) =>
  renderWithFormikProvider(
    <>
      <Field>
        {(formikProps) => (
          <InteractiveMap
            geometryStore={new GeometryStore(formikProps)}
            mapConfig={mapConfig}
          />
        )}
      </Field>
    </>
  );

/**
 * The corner the Leaflet watermark is in, or `null` when there is none.
 */
const watermarkCorner = (container) => {
  const badge = container.querySelector('.leaflet-control-attribution');

  return badge ? badge.parentElement.className : null;
};

describe('GeometryEditor tests', () => {
  describe('Render tests', () => {
    it('should render without crashing', () => {
      renderWithFormikProvider(
        <>
          <Field>
            {(formikProps) => (
              <InteractiveMap geometryStore={new GeometryStore(formikProps)} />
            )}
          </Field>
        </>
      );
    });

    it('should frame itself when the configuration says only part of it', () => {
      // `center` and `zoom` are required by Leaflet. They are merged in rather
      // than replaced, so setting one unrelated option does not take the map
      // down.
      const { container } = renderMap({
        mapContainer: { scrollWheelZoom: false },
      });

      expect(container.querySelector('.leaflet-container')).toBeTruthy();
    });
  });

  describe('Watermark tests', () => {
    it('should read the watermark position from the map configuration', () => {
      const { container } = renderMap({ watermarkPosition: 'topright' });

      expect(watermarkCorner(container)).toBe('leaflet-top leaflet-right');
    });

    it('should take the watermark away when the configuration says null', () => {
      const { container } = renderMap({ watermarkPosition: null });

      expect(watermarkCorner(container)).toBeNull();
    });
  });
});
