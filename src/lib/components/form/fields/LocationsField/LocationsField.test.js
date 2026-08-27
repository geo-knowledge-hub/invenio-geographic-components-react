/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { LocationsField } from './LocationsField';
import { fireEvent, renderWithFormikProvider, screen } from '@tests/setup';

/**
 * Open the map operation function
 */
const openTheMap = () => {
  fireEvent.click(screen.getByText('Add location'));
  fireEvent.click(screen.getAllByText('Use')[0]);
};

/**
 * The corner the Leaflet watermark is in, or `null` when there is none.
 *
 * The modal is rendered in a portal, so this reads the whole document.
 */
const watermarkCorner = () => {
  const badge = document.querySelector('.leaflet-control-attribution');

  return badge ? badge.parentElement.className : null;
};

describe('LocationsField tests', () => {
  describe('Render tests', () => {
    it('should render without crashing', () => {
      renderWithFormikProvider(
        <>
          <LocationsField />
        </>
      );
    });
  });

  describe('Watermark tests', () => {
    it('should hand the position down to the map', () => {
      renderWithFormikProvider(
        <LocationsField watermarkPosition={'topleft'} />
      );

      openTheMap();

      expect(watermarkCorner()).toBe('leaflet-top leaflet-left');
    });

    it('should take the watermark away when the position is null', () => {
      renderWithFormikProvider(<LocationsField watermarkPosition={null} />);

      openTheMap();

      expect(watermarkCorner()).toBeNull();
    });

    it('should read the position from the map configuration too', () => {
      renderWithFormikProvider(
        <LocationsField
          interactiveMapConfig={{ mapConfig: { watermarkPosition: null } }}
        />
      );

      openTheMap();

      expect(watermarkCorner()).toBeNull();
    });

    it('should let the property win over the configuration key', () => {
      renderWithFormikProvider(
        <LocationsField
          interactiveMapConfig={{ mapConfig: { watermarkPosition: null } }}
          watermarkPosition={'bottomleft'}
        />
      );

      openTheMap();

      expect(watermarkCorner()).toBe('leaflet-bottom leaflet-left');
    });

    it('should leave the watermark alone when neither is given', () => {
      renderWithFormikProvider(<LocationsField />);

      openTheMap();

      expect(watermarkCorner()).toBe('leaflet-bottom leaflet-right');
    });
  });
});
