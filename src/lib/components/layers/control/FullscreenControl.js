/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import L from 'leaflet';
import 'leaflet.fullscreen';

import { createControlComponent } from '@react-leaflet/core';

/**
 * Fullscreen control component.
 *
 * @see https://react-leaflet.js.org/docs/core-api/#high-level-component-factories
 */
export const FullscreenControl = createControlComponent((props) =>
  L.control.fullscreen(props)
);
