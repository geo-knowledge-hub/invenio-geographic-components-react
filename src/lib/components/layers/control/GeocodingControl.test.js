/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import L from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';

import { GeocodingControl } from './GeocodingControl';
import { renderWithMapContainer } from '@tests/setup';

describe('GeocoderControl tests', () => {
  describe('Render tests', () => {
    it('should render without crashing', () => {
      renderWithMapContainer(
        <>
          <GeocodingControl />
        </>
      );
    });

    it('should render with another geocoding provider without crashing', () => {
      renderWithMapContainer(
        <>
          <GeocodingControl providerName={'photon'} />
        </>
      );
    });
  });
});
