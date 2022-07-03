/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { LocationField } from './LocationField';
import { renderWithFormikProvider } from '@tests/setup';

describe('LocationField tests', () => {
  describe('Render tests', () => {
    it('should render without crashing', () => {
      renderWithFormikProvider(
        <>
          <LocationField
            action={'add'}
            trigger={<button>Trigger button</button>}
            initialLocation={{}}
            interactiveMapProps={{
              context: {
                center: [42.09618442380296, -71.5045166015625],
                zoom: 2,
                zoomControl: true,
              },
              geocoding: {
                providerName: 'photon',
              },
            }}
          />
        </>
      );
    });
  });
});
