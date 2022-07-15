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
  });
});
