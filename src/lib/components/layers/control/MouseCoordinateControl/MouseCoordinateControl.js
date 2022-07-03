/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import L from 'leaflet';
import { createControlComponent } from '@react-leaflet/core';

import './base';

/**
 * Mouse Coordinate location component.
 */
export const MouseCoordinateControl = createControlComponent((props) =>
  L.Control.mouseCoordinate(props)
);
