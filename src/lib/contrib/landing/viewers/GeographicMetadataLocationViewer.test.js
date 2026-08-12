/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import axios from 'axios';

import { SAO_PAULO_POINT, ZURICH_POINT } from '@tests/mock/spatial/points';
import {
  SAO_PAULO,
  ZURICH,
  recordOf,
  referencesTo,
} from '@tests/mock/vocabularies/geoidentifiers';
import { render, screen } from '@tests/setup';

import { GeographicMetadataLocationViewer } from './GeographicMetadataLocationViewer';

jest.mock('axios');

const answerWith = (...ids) =>
  axios.get.mockResolvedValue({
    data: { hits: { hits: ids.map(recordOf), total: ids.length } },
  });

/**
 * How many shapes the map ended up drawing.
 */
const drawnLayers = () => {
  return document.querySelectorAll(
    '.leaflet-marker-icon, .leaflet-interactive'
  );
};

describe('GeographicMetadataLocationViewer tests', () => {
  beforeEach(() => {
    answerWith(SAO_PAULO);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Render tests', () => {
    it('should render without crashing', () => {
      // Render the viewer
      render(<GeographicMetadataLocationViewer featuresData={[]} />);
    });

    it('should ask the vocabulary for nothing when there are no places', () => {
      // Render the viewer
      render(
        <GeographicMetadataLocationViewer
          featuresData={[{ place: 'Somewhere', geometry: SAO_PAULO_POINT }]}
        />
      );

      // Validate the axios calls
      expect(axios.get).not.toHaveBeenCalled();
    });
  });

  describe('The places a record points at', () => {
    it('should name a place the record only references', async () => {
      // Render the viewer
      render(
        <GeographicMetadataLocationViewer
          featuresData={[{ identifiers: referencesTo(SAO_PAULO) }]}
        />
      );

      // Validate the names
      expect(
        await screen.findByText('São Paulo', undefined, { timeout: 4000 })
      ).toBeTruthy();

      // Validate the description
      expect(
        screen.getByText(
          'Brazil · São Paulo · seat of a first-order administrative division'
        )
      ).toBeTruthy();
    });

    it('should read every place back in one request', async () => {
      // Answer with the two places
      answerWith(SAO_PAULO, ZURICH);

      // Render the viewer
      render(
        <GeographicMetadataLocationViewer
          featuresData={[
            { identifiers: referencesTo(SAO_PAULO) },
            {
              // The same place twice over two locations is one place.
              identifiers: referencesTo(ZURICH, SAO_PAULO),
            },
          ]}
        />
      );

      // Validate the names
      await screen.findByText('Zürich', undefined, { timeout: 4000 });

      // Validate the axios calls
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('/api/geoidentifiers', {
        params: {
          q: `id:("${SAO_PAULO}" OR "${ZURICH}")`,
          size: 2,
        },
      });
    });

    it('should keep an identifier the vocabulary cannot resolve', async () => {
      // Answer with nothing
      answerWith();

      // Render the viewer
      render(
        <GeographicMetadataLocationViewer
          featuresData={[{ identifiers: referencesTo(SAO_PAULO) }]}
        />
      );

      // Validate the name
      expect(
        await screen.findByText(SAO_PAULO, undefined, { timeout: 4000 })
      ).toBeTruthy();
    });

    it('should open the whole record on request', async () => {
      // Render the viewer
      render(
        <GeographicMetadataLocationViewer
          featuresData={[{ identifiers: referencesTo(SAO_PAULO) }]}
        />
      );

      // Get the details
      const details = await screen.findByLabelText(
        'Details about São Paulo',
        undefined,
        { timeout: 4000 }
      );

      // Click the details
      details.click();

      // Only the modal shows the timezone.
      expect(document.body.textContent).toContain('America/Sao_Paulo');
    });

    it('should leave the places alone when there is no vocabulary to read', () => {
      // Render the viewer
      render(
        <GeographicMetadataLocationViewer
          identifiersApiUrl={''}
          featuresData={[{ identifiers: referencesTo(SAO_PAULO) }]}
        />
      );

      // Validate the axios calls
      expect(axios.get).not.toHaveBeenCalled();
      expect(screen.getByText(SAO_PAULO)).toBeTruthy();
    });
  });

  describe('What the map draws', () => {
    it('should draw a place the record does not hold the geometry of', async () => {
      // Render the viewer
      render(
        <GeographicMetadataLocationViewer
          featuresData={[{ identifiers: referencesTo(SAO_PAULO) }]}
        />
      );

      // Validate the name
      await screen.findByText('São Paulo', undefined, { timeout: 4000 });

      // Validate the drawn layers
      expect(drawnLayers()).toHaveLength(1);
    });

    it('should not draw a place the record already stores', async () => {
      // `Add to map` puts exactly this point in the record, so drawing the
      // place as well would stack a second marker on the first
      render(
        <GeographicMetadataLocationViewer
          featuresData={[
            {
              place: 'São Paulo',
              geometry: SAO_PAULO_POINT,
              identifiers: referencesTo(SAO_PAULO),
            },
          ]}
        />
      );

      // Validate the name
      await screen.findByText(
        'Brazil · São Paulo · seat of a first-order administrative division',
        undefined,
        { timeout: 4000 }
      );

      // Validate the drawn layers
      expect(drawnLayers()).toHaveLength(1);
    });

    it('should not draw either of two places the record already stores', async () => {
      // Answer with the two places
      answerWith(SAO_PAULO, ZURICH);

      // Render the viewer
      render(
        <GeographicMetadataLocationViewer
          featuresData={[
            {
              place: 'Two places',
              geometry: {
                type: 'MultiPoint',
                coordinates: [
                  SAO_PAULO_POINT.coordinates,
                  ZURICH_POINT.coordinates,
                ],
              },
              identifiers: referencesTo(SAO_PAULO, ZURICH),
            },
          ]}
        />
      );

      // Validate the name
      await screen.findByText('Zürich', undefined, { timeout: 4000 });

      // Validate the drawn layers
      expect(drawnLayers()).toHaveLength(2);
    });

    it('should draw the place the record stores and the one it does not', async () => {
      // Answer with the two places
      answerWith(SAO_PAULO, ZURICH);

      // Render the viewer
      render(
        <GeographicMetadataLocationViewer
          featuresData={[
            {
              geometry: SAO_PAULO_POINT,
              identifiers: referencesTo(SAO_PAULO, ZURICH),
            },
          ]}
        />
      );

      // Validate the name
      await screen.findByText('Zürich', undefined, { timeout: 4000 });

      // Validate the drawn layers
      expect(drawnLayers()).toHaveLength(2);
    });
  });
});
