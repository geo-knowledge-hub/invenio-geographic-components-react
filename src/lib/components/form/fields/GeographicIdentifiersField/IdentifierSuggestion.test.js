/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { SAO_PAULO, recordOf } from '@tests/mock/vocabularies/geoidentifiers';
import { render } from '@tests/setup';

import { IdentifierSuggestion } from './IdentifierSuggestion';

describe('IdentifierSuggestion tests', () => {
  it('should show what separates a place from its namesakes', () => {
    // Render the component
    const { getByText } = render(
      <IdentifierSuggestion record={recordOf(SAO_PAULO)} />
    );

    // Check if the name is displayed
    expect(getByText('São Paulo')).toBeTruthy();
    expect(
      getByText(
        'Brazil · São Paulo · seat of a first-order administrative division'
      )
    ).toBeTruthy();

    expect(getByText(`Population ${(12400232).toLocaleString()}`)).toBeTruthy();
  });

  it('should show only the name when the record holds nothing else', () => {
    // Render the component
    const { container, getByText } = render(
      <IdentifierSuggestion record={{ id: 'geonames::1', name: 'Somewhere' }} />
    );

    // Check if the name is displayed
    expect(getByText('Somewhere')).toBeTruthy();
    expect(container.querySelector('.sub.header')).toBe(null);
    expect(container.querySelector('.ui.label')).toBe(null);
  });
});
