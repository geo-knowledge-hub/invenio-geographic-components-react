/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { createRef } from 'react';

import { SAO_PAULO_POINT, ZURICH_POINT } from '@tests/mock/spatial/points';
import { act, renderWithFormikProvider, screen } from '@tests/setup';

import { GeometryField } from './GeometryField';

/**
 * Render the field over a form, and hand back the handle a location modal holds.
 */
const renderField = (props = {}, initialValues = { geometry: {} }) => {
  const ref = createRef();

  renderWithFormikProvider(
    <GeometryField ref={ref} fieldPath={'geometry'} {...props} />,
    { initialValues }
  );

  return {
    addGeometry: (geometry) => act(() => ref.current.addGeometry(geometry)),
  };
};

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

  describe('Refusals', () => {
    it('should say a geometry is already there', async () => {
      // Render the field
      const { addGeometry } = renderField({}, { geometry: SAO_PAULO_POINT });

      // Add the geometry
      addGeometry(SAO_PAULO_POINT);

      // Check if the message is displayed
      expect(
        await screen.findByText('This geometry is already on the map.')
      ).toBeTruthy();
    });

    it('should say the location holds one geometry', async () => {
      // Render the field
      const { addGeometry } = renderField(
        { uniqueLayer: true },
        { geometry: SAO_PAULO_POINT }
      );

      // Add the geometry
      addGeometry(ZURICH_POINT);

      // Check if the message is displayed
      expect(
        await screen.findByText(
          'This location holds one geometry. Remove the one on the map to add another.'
        )
      ).toBeTruthy();
    });

    it('should say what the repository stores', async () => {
      // Render the field and add a single point
      const { addGeometry } = renderField(
        { geometryTypes: ['Point'] },
        { geometry: SAO_PAULO_POINT }
      );

      // Add a second point
      addGeometry(ZURICH_POINT);

      // Check if the message is displayed
      expect(
        await screen.findByText(
          'Together with what is already there this would be a MultiPoint, and this repository stores Point.'
        )
      ).toBeTruthy();
    });

    it('should say it below the map rather than above it', async () => {
      // The button that asked for the geometry is above the map too, so a
      // refusal reported up there is a refusal nobody reads.
      const { addGeometry } = renderField({}, { geometry: SAO_PAULO_POINT });

      // Add the geometry
      addGeometry(SAO_PAULO_POINT);

      // Check if the message is displayed
      const message = await screen.findByText(
        'This geometry is already on the map.'
      );

      const map = document.querySelector('.ui.placeholder.segment');

      // Lmaddemp
      expect(map).toBeTruthy();
      expect(
        map.compareDocumentPosition(message) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });

    it('should keep quiet when the geometry is accepted', () => {
      const { addGeometry } = renderField({}, { geometry: SAO_PAULO_POINT });

      addGeometry(ZURICH_POINT);

      expect(screen.queryByText('Geometry not added')).toBe(null);
    });
  });
});
