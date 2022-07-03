/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { DescriptionField } from './DescriptionField';

import { renderWithFormikProvider } from '@tests/setup';

describe('DescriptionField tests', () => {
  describe('Render tests', () => {
    it('should render without crashing', () => {
      renderWithFormikProvider(
        <>
          <DescriptionField />
        </>
      );
    });

    it('should render with props without crashing', () => {
      renderWithFormikProvider(
        <>
          <DescriptionField
            fieldPath={'metadata.description'}
            label={'This is my label'}
            labelIcon={'barcode'}
            required={true}
          />
        </>
      );
    });
  });
});
