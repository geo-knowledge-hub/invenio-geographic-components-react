/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import axios from 'axios';

import { SAO_PAULO_POINT } from '@tests/mock/spatial/points';
import { suggestions } from '@tests/mock/vocabularies/geoidentifiers';
import { cards, suggest } from '@tests/identifiers-field';
import {
  fireEvent,
  renderWithFormikProvider,
  screen,
  wait,
} from '@tests/setup';

import { LocationsModal } from './LocationsModal';

jest.mock('axios');

/**
 * Open the modal, as a depositor adding a location does.
 */
const openModal = (props = {}) => {
  renderWithFormikProvider(
    <LocationsModal
      action={'add'}
      trigger={<button>Trigger button</button>}
      initialLocation={{}}
      {...props}
    />
  );

  fireEvent.click(screen.getByText('Trigger button'));
};

describe('LocationField tests', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: suggestions });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Render tests', () => {
    it('should render without crashing', () => {
      renderWithFormikProvider(
        <>
          <LocationsModal
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

  describe('Identifiers configuration', () => {
    it('should read the vocabulary from the API the instance configured', async () => {
      // Open the modal, as an instance serving the vocabulary elsewhere does
      openModal({ identifiersConfig: { suggestionAPIUrl: '/api/places' } });

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

    it('should offer the vocabularies the instance configured', () => {
      openModal({
        identifiersConfig: {
          limitOptions: [{ text: 'Places', value: 'places' }],
        },
      });

      // The selector shows the chosen vocabulary and offers it in the menu, so
      // the name is on the page more than once
      expect(screen.getAllByText('Places').length).toBeGreaterThan(0);
      expect(screen.queryByText('GeoNames')).toBe(null);
    });
  });

  describe('A place on the map', () => {
    it('should say a place is on the map once it has been added', async () => {
      // Open the modal
      openModal();

      // Choose a place
      fireEvent.click(await suggest('Sao Paul'));

      // Click the add to map button
      fireEvent.click(cards().getByText('Add to map'));

      // The offer is not made twice: the row reports where the place is
      // instead, so the second click is never available to be refused.
      expect(cards().queryByText('Add to map')).toBe(null);
      expect(cards().getByText('On map')).toBeTruthy();
    });

    it('should keep one point when a place is added twice', async () => {
      // Render the modal
      const onLocationChange = jest.fn();

      // Open the modal
      openModal({ onLocationChange });

      // Choose a place
      fireEvent.click(await suggest('Sao Paul'));

      // Get the add to map button
      const addToMap = cards().getByText('Add to map').closest('button');

      // Click the add to map button
      fireEvent.click(addToMap);
      fireEvent.click(addToMap);
      fireEvent.click(screen.getByText('Save'));

      // One point, not a MultiPoint of the same position twice.
      await wait(() =>
        expect(onLocationChange).toHaveBeenCalledWith(
          expect.objectContaining({ geometry: SAO_PAULO_POINT })
        )
      );
    });
  });
});
