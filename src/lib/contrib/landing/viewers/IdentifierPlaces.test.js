/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import {
  SAO_PAULO,
  ZURICH,
  recordsFor,
  referencesTo,
} from '@tests/mock/vocabularies/geoidentifiers';
import { fireEvent, render } from '@tests/setup';

import { IdentifierPlaces } from './IdentifierPlaces';

describe('IdentifierPlaces tests', () => {
  it('should show nothing when a record points at nowhere', () => {
    const { container } = render(
      <IdentifierPlaces identifiers={[]} onSelect={jest.fn()} />
    );

    expect(container.firstChild).toBe(null);
  });

  it('should list a row for each place', () => {
    const { getByText } = render(
      <IdentifierPlaces
        identifiers={referencesTo(SAO_PAULO, ZURICH)}
        records={recordsFor(SAO_PAULO, ZURICH)}
        onSelect={jest.fn()}
      />
    );

    expect(getByText('São Paulo')).toBeTruthy();
    expect(getByText('Zürich')).toBeTruthy();

    expect(
      getByText(
        'Switzerland · Zurich · seat of a first-order administrative division'
      )
    ).toBeTruthy();
  });

  it('should ask for a place to be shown on the map', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <IdentifierPlaces
        identifiers={referencesTo(SAO_PAULO)}
        records={recordsFor(SAO_PAULO)}
        onSelect={onSelect}
      />
    );

    // Click the place
    fireEvent.click(getByText('São Paulo'));

    // Validate the selection
    expect(onSelect).toHaveBeenCalledWith(SAO_PAULO);
  });

  it('should reach a place from the keyboard', () => {
    // Define the selection
    const onSelect = jest.fn();

    // Render the places
    const { getByText } = render(
      <IdentifierPlaces
        identifiers={referencesTo(SAO_PAULO)}
        records={recordsFor(SAO_PAULO)}
        onSelect={onSelect}
      />
    );

    // Get the place
    const place = getByText('São Paulo').closest('a');

    expect(place.tabIndex).toBe(0);

    // Press the enter key
    fireEvent.keyDown(place, { key: 'Enter' });

    // Validate the selection
    expect(onSelect).toHaveBeenCalledWith(SAO_PAULO);
  });

  it('should show an unresolved place as what the record stores', () => {
    // Render the places
    const { getByText } = render(
      <IdentifierPlaces
        identifiers={referencesTo(SAO_PAULO)}
        onSelect={jest.fn()}
      />
    );

    // Validate the name
    expect(getByText(SAO_PAULO)).toBeTruthy();
  });
});
