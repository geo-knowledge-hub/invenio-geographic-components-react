/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import axios from 'axios';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { suggestions } from '@tests/mock/vocabularies/geoidentifiers';
import { suggest } from '@tests/identifiers-field';

import { LocationsFieldItem } from './LocationsFieldItem';
import { fireEvent, renderWithFormikProvider, screen } from '@tests/setup';

jest.mock('axios');

/**
 * Render an existing location, as the list of chosen ones does.
 */
const renderItem = (props = {}) =>
  renderWithFormikProvider(
    <DndProvider backend={HTML5Backend}>
      <LocationsFieldItem
        index={0}
        referenceKey={'a.b.c'}
        identifiersError={[]}
        replaceLocation={(index, item) => {}}
        removeLocation={(index) => {}}
        moveLocation={(itemOne, itemTwo) => {}}
        {...props}
      />
    </DndProvider>
  );

describe('LocationsFieldItem tests', () => {
  describe('Render tests', () => {
    it('should render without crashing', () => {
      renderItem();
    });
  });

  describe('Identifiers tests', () => {
    beforeEach(() => {
      axios.get.mockResolvedValue({ data: suggestions });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should hand the vocabulary API down to the edit modal', async () => {
      // Editing a location goes through a modal of its own, so it is reached
      // separately from the one adding a location
      renderItem({ identifiersConfig: { suggestionAPIUrl: '/api/places' } });

      // Open the modal, as a depositor changing a location does
      fireEvent.click(screen.getByText('Edit'));

      // Type to get suggestions
      await suggest('Sao Paul');

      // The search is made against the configured API, not the default one
      expect(axios.get).toHaveBeenCalledWith(
        '/api/places',
        expect.objectContaining({
          params: expect.objectContaining({ suggest: 'geonames:Sao Paul' }),
        })
      );
    });
  });
});
