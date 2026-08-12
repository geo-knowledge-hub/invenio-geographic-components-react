/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { ZURICH, recordOf } from '@tests/mock/vocabularies/geoidentifiers';
import { fireEvent, render, within } from '@tests/setup';

import { IdentifierCard } from './IdentifierCard';

// Define a record
const record = recordOf(ZURICH);

describe('IdentifierCard tests', () => {
  it('should show which place was chosen', () => {
    // Render the component
    const { getByText } = render(
      <IdentifierCard record={record} onRemove={jest.fn()} />
    );

    expect(getByText('Zürich')).toBeTruthy();
    expect(getByText('Geonames')).toBeTruthy();
    expect(
      getByText(
        'Switzerland · Zurich · seat of a first-order administrative division'
      )
    ).toBeTruthy();

    // Check if the population is displayed
    expect(
      getByText(`Population ${(415367).toLocaleString()} · 47.36667, 8.55`)
    ).toBeTruthy();
  });

  it('should gather every action in one place', () => {
    // Render the component
    const { container } = render(
      <IdentifierCard
        record={record}
        onRemove={jest.fn()}
        onAddGeometry={jest.fn()}
      />
    );

    // Check if the actions are displayed
    const actions = within(
      container.querySelector('.geographic-identifier-card-actions')
    );

    // Check if the details are displayed
    expect(actions.getByText('Details')).toBeTruthy();
    expect(actions.getByText('Add to map')).toBeTruthy();
    expect(actions.getByLabelText('Remove Zürich')).toBeTruthy();
  });

  it('should drop the place it stands for', () => {
    // Define a function to remove the record
    const onRemove = jest.fn();

    // Render the component
    const { getByLabelText } = render(
      <IdentifierCard record={record} onRemove={onRemove} />
    );

    // Click the remove button
    fireEvent.click(getByLabelText('Remove Zürich'));

    // Check if the function was called with the record
    expect(onRemove).toHaveBeenCalledWith(record);
  });

  it('should hand its geometry to the map', () => {
    // Define a function to add the geometry
    const onAddGeometry = jest.fn();

    // Render the component
    const { getByText } = render(
      <IdentifierCard
        record={record}
        onRemove={jest.fn()}
        onAddGeometry={onAddGeometry}
      />
    );

    // Click the add to map button
    fireEvent.click(getByText('Add to map'));

    // Check if the function was called with the geometry
    expect(onAddGeometry).toHaveBeenCalledWith({
      type: 'Point',
      coordinates: [8.55, 47.36667],
    });
  });

  it('should offer no map action when there is no map', () => {
    // Render the component
    const { queryByText } = render(
      <IdentifierCard record={record} onRemove={jest.fn()} />
    );

    expect(queryByText('Add to map')).toBe(null);
  });

  it('should offer no map action for a place that has no geometry', () => {
    const { queryByText } = render(
      <IdentifierCard
        record={{ id: 'geonames::1', name: 'Somewhere' }}
        onRemove={jest.fn()}
        onAddGeometry={jest.fn()}
      />
    );

    expect(queryByText('Add to map')).toBe(null);
  });

  it('should say a place is on the map rather than offer it again', () => {
    // Define a function to check if the geometry is on the map
    const isGeometryOnMap = jest.fn(() => true);

    // Render the component
    const { getByText, queryByText } = render(
      <IdentifierCard
        record={record}
        onRemove={jest.fn()}
        onAddGeometry={jest.fn()}
        isGeometryOnMap={isGeometryOnMap}
      />
    );

    // Check if the add to map button is not displayed
    expect(queryByText('Add to map')).toBe(null);
    expect(getByText('On map').closest('button').disabled).toBe(true);

    // Check if the function was called with the geometry
    expect(isGeometryOnMap).toHaveBeenCalledWith({
      type: 'Point',
      coordinates: [8.55, 47.36667],
    });
  });

  it('should keep offering a place the map does not have', () => {
    // Render the component
    const { getByText, queryByText } = render(
      <IdentifierCard
        record={record}
        onRemove={jest.fn()}
        onAddGeometry={jest.fn()}
        isGeometryOnMap={() => false}
      />
    );

    expect(queryByText('On map')).toBe(null);
    expect(getByText('Add to map')).toBeTruthy();
  });

  it('should open the whole record on request', () => {
    const { getByText } = render(
      <IdentifierCard record={record} onRemove={jest.fn()} />
    );

    fireEvent.click(getByText('Details'));

    // Check if the timezone is displayed
    expect(document.body.textContent).toContain('Europe/Zurich');
  });
});
