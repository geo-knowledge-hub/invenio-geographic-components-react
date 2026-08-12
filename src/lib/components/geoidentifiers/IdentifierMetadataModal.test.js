/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { Button } from 'semantic-ui-react';

import {
  PARIS,
  SAO_PAULO,
  SPRINGFIELD,
  recordOf,
} from '@tests/mock/vocabularies/geoidentifiers';
import { fireEvent, render, screen } from '@tests/setup';

import { IdentifierMetadataModal } from './IdentifierMetadataModal';

/**
 * Open the modal
 * @param {Object} record The record to open the modal for
 */
const open = (record) => {
  // Render the modal
  render(
    <IdentifierMetadataModal
      record={record}
      trigger={<Button content={'Details'} />}
    />
  );

  fireEvent.click(screen.getByText('Details'));
};

describe('IdentifierMetadataModal tests', () => {
  it('should stay closed until it is asked for', () => {
    render(
      <IdentifierMetadataModal
        record={recordOf(PARIS)}
        trigger={<Button content={'Details'} />}
      />
    );

    expect(document.body.textContent).not.toContain('Europe/Paris');
  });

  it('should lay out the whole record', () => {
    // Open the modal
    open(recordOf(PARIS));

    // Validate "extra", and here we are just doing the basics
    expect(screen.getAllByText('Paris')).toHaveLength(2);
    expect(screen.getByText('France (FR)')).toBeTruthy();
    expect(screen.getByText('Île-de-France (11)')).toBeTruthy();
    expect(
      screen.getByText('capital of a political entity (PPLC)')
    ).toBeTruthy();
    expect(screen.getByText('Europe/Paris')).toBeTruthy();
    expect(screen.getByText('48.85341, 2.3488')).toBeTruthy();
  });

  it('should fold away the names beyond the first few', () => {
    // Open the modal
    open(recordOf(SAO_PAULO));

    // Validate "extra"
    expect(screen.getByText('Also known as')).toBeTruthy();
    expect(screen.getByText('Sampa')).toBeTruthy();

    // Check if the alternate names are folded away
    expect(screen.queryByText('Urbs Paulistana')).toBe(null);

    // Click the "Show more" button
    fireEvent.click(screen.getByText('Show 72 more'));

    // Check if the alternate names are unfolded
    expect(screen.getByText('Urbs Paulistana')).toBeTruthy();

    // Click the "Show fewer" button
    fireEvent.click(screen.getByText('Show fewer'));

    // Check if the alternate names are folded away
    expect(screen.queryByText('Urbs Paulistana')).toBe(null);
  });

  it('should say nothing about names a place does not have', () => {
    open(recordOf(SPRINGFIELD));

    expect(screen.getAllByText('Springfield')).toHaveLength(2);
    expect(screen.queryByText('Also known as')).toBe(null);
  });
});
