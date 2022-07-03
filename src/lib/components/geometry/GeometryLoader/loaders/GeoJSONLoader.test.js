/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { Dropdown } from 'semantic-ui-react';

import { GeoJSONLoader } from './GeoJSONLoader';
import { renderWithMapContainer } from '@tests/setup';

describe('GeoJSONLoader tests', () => {
  describe('Render tests', () => {
    it('should render without crashing', () => {
      renderWithMapContainer(
        <Dropdown>
          <GeoJSONLoader onImport={(data) => {}} />
        </Dropdown>
      );
    });
    it('should render without crashing when a specialized Dropdown.Item configuration is used', () => {
      renderWithMapContainer(
        <Dropdown>
          <GeoJSONLoader
            onImport={(data) => {}}
            dropdownItemConfig={{ onClick: (e) => {} }}
          />
        </Dropdown>
      );
    });
  });
});
