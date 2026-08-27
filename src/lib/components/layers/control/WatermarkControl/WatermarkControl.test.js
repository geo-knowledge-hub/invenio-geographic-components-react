/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { WatermarkControl, WATERMARK_POSITIONS } from './WatermarkControl';
import { renderWithMapContainer } from '@tests/setup';

const mapOptions = { center: [0, 0], zoom: 1 };

/**
 * The corner the badge is in, as Leaflet names it, or `null` when there is none.
 */
const cornerOf = (container) => {
  const badge = container.querySelector('.leaflet-control-attribution');

  return badge ? badge.parentElement.className : null;
};

const corners = {
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
};

describe('WatermarkControl tests', () => {
  describe('Render tests', () => {
    it('should render without crashing', () => {
      renderWithMapContainer(<WatermarkControl />, mapOptions);
    });
  });

  describe('Position tests', () => {
    it.each(WATERMARK_POSITIONS)('should put the badge in %s', (position) => {
      const { container } = renderWithMapContainer(
        <WatermarkControl position={position} />,
        mapOptions
      );

      expect(cornerOf(container)).toBe(corners[position]);
    });

    it('should leave the map as it was built when no position is given', () => {
      const { container } = renderWithMapContainer(
        <WatermarkControl />,
        mapOptions
      );

      expect(cornerOf(container)).toBe(corners.bottomright);
    });

    it('should leave a map built without a badge alone', () => {
      const { container } = renderWithMapContainer(<WatermarkControl />, {
        ...mapOptions,
        attributionControl: false,
      });

      expect(cornerOf(container)).toBeNull();
    });
  });

  describe('Visibility tests', () => {
    it('should take the badge away when the position is null', () => {
      const { container } = renderWithMapContainer(
        <WatermarkControl position={null} />,
        mapOptions
      );

      expect(cornerOf(container)).toBeNull();
    });

    it('should put a badge up on a map built without one', () => {
      const { container } = renderWithMapContainer(
        <WatermarkControl position={'topleft'} />,
        { ...mapOptions, attributionControl: false }
      );

      expect(cornerOf(container)).toBe(corners.topleft);
    });
  });
});
