/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { GeographicIdentifiersField } from './GeographicIdentifiersField';
import { renderWithFormikProvider } from '@tests/setup';

describe('GeographicIdentifiersField tests', () => {
  describe('Render tests', () => {
    it('should render without crashing', () => {
      renderWithFormikProvider(
        <>
          <GeographicIdentifiersField />
        </>
      );
    });

    it('should render with props without crashing', () => {
      renderWithFormikProvider(
        <>
          <GeographicIdentifiersField
            fieldPath={'metadata.place'}
            label={'This is my label'}
            labelIcon={'barcode'}
            required={true}
          />
        </>
      );
    });
  });
});
