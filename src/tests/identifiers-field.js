/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Driving the geographic identifiers field in a rendered page.
 *
 * The field is tested on its own and again through the location modal that
 * embeds it, and both need the same two things: a way to reach the list of
 * chosen places, and a way to type into the search box.
 *
 * Imports the library directly rather than through `@tests/setup`, so that a
 * helper carries none of that module's side effects.
 */

import { fireEvent, screen, within } from '@testing-library/react';

/**
 * The list of chosen places.
 */
export const cards = () =>
  within(document.querySelector('.geographic-identifier-cards'));

/**
 * Type into the search box and wait for the offered place to appear.
 */
export const suggest = async (query, expected = 'São Paulo') => {
  const input = document.getElementById('identifiers');

  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: query } });

  return screen.findByText(expected, undefined, { timeout: 4000 });
};
