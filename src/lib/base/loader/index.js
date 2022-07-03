/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { WFSLoader } from './wfs';
import { GeoJSONLoader } from './geojson';

export const GeometryLoader = {
  GeoJSONLoader,
  WFSLoader,
};
