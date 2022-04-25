/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import { render } from '@testing-library/react';

test('Basic App test', () => {
  // ToDo: add tests for the components itself.
  const { getByText } = render(<h1>GEO Metadata Previewer</h1>);

  expect(getByText('GEO Metadata Previewer')).toBeInTheDocument();
});
