/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { GeometryLoader } from './GeometryLoader';
import { renderWithMapContainer } from '@tests/setup';

describe('GeocoderControl tests', () => {
  describe('Render tests', () => {
    it('should render without crashing', () => {
      renderWithMapContainer(
        <>
          <GeometryLoader uploadCallback={(data) => {}} />
        </>
      );
    });
    it('should render without crashing when a specialized dropdown is used', () => {
      renderWithMapContainer(
        <>
          <GeometryLoader
            uploadCallback={(data) => {}}
            dropdownConfig={{
              text: 'Import data',
              button: true,
            }}
          />
        </>
      );
    });
  });
});
