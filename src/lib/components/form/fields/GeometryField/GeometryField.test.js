/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { GeometryField } from './GeometryField';
import { renderWithFormikProvider } from '@tests/setup';

describe('GeometryField tests', () => {
  describe('Render tests', () => {
    it('should render without crashing', () => {
      renderWithFormikProvider(
        <>
          <GeometryField />
        </>
      );
    });

    it('should render with props without crashing', () => {
      renderWithFormikProvider(
        <>
          <GeometryField
            fieldPath={'geometryField2'}
            label={'Custom Label'}
            labelIcon={'question circle'}
          />
        </>
      );
    });
  });
});
