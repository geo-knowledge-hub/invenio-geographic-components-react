/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import axios from 'axios';
import { useFormikContext } from 'formik';

import {
  SAO_PAULO,
  ZURICH,
  recordOf,
  records,
  suggestions,
} from '@tests/mock/vocabularies/geoidentifiers';
import { cards, suggest } from '@tests/identifiers-field';
import { fireEvent, renderWithFormikProvider, screen } from '@tests/setup';

import { GeographicIdentifiersField } from './GeographicIdentifiersField';

jest.mock('axios');

/**
 * Records what the form holds, so a test can read it back.
 */
const FormValues = ({ onChange }) => {
  const { values } = useFormikContext();

  onChange(values);

  return null;
};

/**
 * Render the field over a form, and hand back a reader of the form values.
 */
const renderField = (props = {}, initialValues = { identifiers: [] }) => {
  let values = initialValues;

  const utils = renderWithFormikProvider(
    <>
      <GeographicIdentifiersField {...props} />
      <FormValues onChange={(current) => (values = current)} />
    </>,
    { initialValues }
  );

  return { ...utils, identifiers: () => values.identifiers };
};

/**
 * The rows the search box is offering, as opposed to the scheme selector.
 */
const menuItems = () =>
  Array.from(
    document.querySelectorAll('.invenio-remote-select-field .menu > .item')
  );

describe('GeographicIdentifiersField tests', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: suggestions });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Render tests', () => {
    it('should render without crashing', () => {
      renderField();
    });

    it('should render with props without crashing', () => {
      renderField({
        fieldPath: 'identifiers',
        label: 'This is my label',
        labelIcon: 'barcode',
        required: true,
      });
    });
  });

  describe('Suggestions', () => {
    it('should scope the query to the chosen scheme', async () => {
      // Render field
      renderField();

      // Type to get suggestions
      await suggest('Sao Paul');

      // Check if the API was called with the correct parameters
      expect(axios.get).toHaveBeenCalledWith(
        '/api/geoidentifiers',
        expect.objectContaining({
          params: expect.objectContaining({ suggest: 'geonames:Sao Paul' }),
        })
      );
    });

    it('should keep a result the query does not spell the same way', async () => {
      // The vocabulary matches `Sao Paul` on the ASCII name and the alternate
      // names, and answers with `São Paulo`.
      // Render field
      renderField();

      // Type to get suggestions
      await suggest('Sao Paul');

      // Check if the suggestion is displayed
      expect(screen.getByText('São Paulo')).toBeTruthy();
    });

    it('should show what tells the suggestions apart', async () => {
      // Render field
      renderField();

      // Type to get suggestions
      await suggest('Sao Paul');

      // Check if the suggestion is displayed
      expect(
        screen.getByText(
          'Brazil · São Paulo · seat of a first-order administrative division'
        )
      ).toBeTruthy();

      // Check if the population is displayed
      expect(
        screen.getByText(`Population ${(12400232).toLocaleString()}`)
      ).toBeTruthy();
    });

    it('should keep places that share a name apart', async () => {
      // Define names
      const namesakes = [
        { ...records[0], id: 'geonames::1', name: 'Springfield' },
        { ...records[1], id: 'geonames::2', name: 'Springfield' },
      ];

      // Mock the API response
      axios.get.mockResolvedValue({
        data: { hits: { hits: namesakes, total: 2 } },
      });

      // Render field
      renderField();

      // Type to get suggestions
      const input = document.getElementById('identifiers');

      // Focus and change the input
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Springfiel' } });

      // Find two options: they are keyed on the identifier, which differs,
      // rather than on the name, which does not
      const options = await screen.findAllByText('Springfield', undefined, {
        timeout: 4000,
      });

      // Check if there are two options
      expect(options).toHaveLength(2);
    });
  });

  describe('Selection', () => {
    it('should store only what an InvenioRDM location may hold', async () => {
      // Every other key is an "Unknown field" to the record schema, so the
      // vocabulary metadata is kept beside the form rather than in it
      // Render field
      const { identifiers } = renderField();

      // Type to get suggestions
      fireEvent.click(await suggest('Sao Paul'));

      // Check if the identifier is stored
      expect(identifiers()).toEqual([
        { scheme: 'geonames', identifier: SAO_PAULO },
      ]);
    });

    it('should keep a card for each chosen place', async () => {
      // Render field
      renderField();

      // Type to get suggestions
      fireEvent.click(await suggest('Sao Paul'));

      // Check if the card is displayed
      expect(
        document.querySelectorAll('.geographic-identifier-card')
      ).toHaveLength(1);

      // Check text content
      expect(cards().getByText('São Paulo')).toBeTruthy();

      // Check details content
      expect(cards().getByText('Details')).toBeTruthy();

      // Check remove button
      expect(cards().getByLabelText('Remove São Paulo')).toBeTruthy();
    });

    it('should describe a place once, in the list and not in the box', async () => {
      // Render field
      renderField();

      // Type to get suggestions
      fireEvent.click(await suggest('Sao Paul'));

      // Check if the search box has no selection
      expect(
        document.querySelectorAll('.ui.dropdown > .ui.label')
      ).toHaveLength(0);

      // Check if the card is displayed
      expect(cards().getAllByText('São Paulo')).toHaveLength(1);
    });

    it('should empty the box once a place moves to the list', async () => {
      // Render field
      renderField();

      // Type to get suggestions
      fireEvent.click(await suggest('Sao Paul'));

      // Check if the menu items are empty
      expect(menuItems()).toHaveLength(0);

      // Check if the search box has no value
      expect(document.getElementById('identifiers').value).toBe('');
    });

    it('should add to the list rather than replace it', async () => {
      // Render field
      const { identifiers } = renderField();

      // Type to get suggestions
      fireEvent.click(await suggest('Sao Paul'));

      // Type to get suggestions
      fireEvent.click(await suggest('Zuri', 'Zürich'));

      // Check if the identifiers are stored
      expect(identifiers()).toEqual([
        { scheme: 'geonames', identifier: SAO_PAULO },
        { scheme: 'geonames', identifier: ZURICH },
      ]);
    });

    it('should stop offering a place that is already listed', async () => {
      // Render field
      renderField();

      // Type to get suggestions
      fireEvent.click(await suggest('Sao Paul'));

      // Type to get suggestions
      await suggest('Sao Paul', 'Zürich');

      // Check if the offered places are displayed
      const offered = menuItems().map((item) => item.textContent);

      // Check displayed places
      expect(offered.some((text) => text.includes('Zürich'))).toBe(true);
      expect(offered.some((text) => text.includes('São Paulo'))).toBe(false);
    });

    it('should drop a place removed from its card', async () => {
      const { identifiers } = renderField();

      fireEvent.click(await suggest('Sao Paul'));
      fireEvent.click(cards().getByLabelText('Remove São Paulo'));

      expect(identifiers()).toEqual([]);
    });
  });

  describe('Geometry', () => {
    it('should hand a chosen place to the map', async () => {
      const onAddGeometry = jest.fn();

      // Render field
      renderField({ onAddGeometry });

      // Get suggestions
      fireEvent.click(await suggest('Sao Paul'));
      fireEvent.click(cards().getByText('Add to map'));

      expect(onAddGeometry).toHaveBeenCalledWith({
        type: 'Point',
        coordinates: [-46.63611, -23.5475],
      });
    });

    it('should offer nothing when there is no map to offer it to', async () => {
      // Render field
      renderField();

      // Get suggestions
      fireEvent.click(await suggest('Sao Paul'));

      expect(cards().queryByText('Add to map')).toBe(null);
    });
  });

  describe('Initial values', () => {
    it('should read back the record behind a stored identifier', async () => {
      // Define record
      const record = recordOf(ZURICH);

      // Mock the API response
      axios.get.mockResolvedValue({ data: record });

      // Render field
      const { identifiers } = renderField(
        {},
        { identifiers: [{ scheme: 'geonames', identifier: ZURICH }] }
      );

      // Check if the record is displayed
      await screen.findByText('Zürich', undefined, { timeout: 4000 });

      // Check if the API was called with the correct parameters
      expect(axios.get).toHaveBeenCalledWith(
        `/api/geoidentifiers/${encodeURIComponent(ZURICH)}`
      );

      // Check if the record is displayed
      expect(cards().getByText('Switzerland', { exact: false })).toBeTruthy();

      expect(identifiers()).toEqual([
        { scheme: 'geonames', identifier: ZURICH },
      ]);
    });

    it('should keep an identifier the vocabulary cannot resolve', async () => {
      // Mock the API response
      axios.get.mockRejectedValue(new Error('gone'));

      // Render field
      const { identifiers } = renderField(
        {},
        { identifiers: [{ scheme: 'geonames', identifier: ZURICH }] }
      );

      // Check if the record is displayed
      await screen.findAllByText(ZURICH, undefined, { timeout: 4000 });

      // Check if the identifier is stored
      expect(identifiers()).toEqual([
        { scheme: 'geonames', identifier: ZURICH },
      ]);
    });
  });
});
