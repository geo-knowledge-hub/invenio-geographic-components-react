/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

import {
  TileLayerControl,
  GeocodingControl,
  FullscreenControl,
  MouseCoordinateControl,
} from '../control';

/**
 * Basic set of layers.
 * @constructor
 *
 * Base map layers to support the development of geographic visualization. The following
 * layers are included by default:
 *
 * - Tile Layer Control;
 * - Geocoding Control;
 * - Fullscreen Control;
 * - Mouse Coordinate Control.
 *
 * @param {Object} layersConfig Configuration object for the following layers:
 *                              - TileLayerControl (`tileLayersConfig`);
 *                              - GeocodingControl (`geocodingConfig`);
 *                              - FullscreenControl (`fullscreenConfig`);
 *                              - MouseCoordinateControl (`mouseCoordinateConfig`).
 *
 * @returns {JSX.Element}
 */
export const BaseMapLayers = ({ ...layersConfig }) => (
  <>
    <TileLayerControl {...layersConfig.tileLayersConfig} />

    <GeocodingControl {...layersConfig.geocodingConfig} />

    <FullscreenControl {...layersConfig.fullscreenConfig} />

    <MouseCoordinateControl {...layersConfig.mouseCoordinateConfig} />
  </>
);

BaseMapLayers.propTypes = {
  tileLayersConfig: PropTypes.object,
  geocodingConfig: PropTypes.object,
  fullscreenConfig: PropTypes.object,
  mouseCoordinateConfig: PropTypes.object,
};

BaseMapLayers.defaultProps = {
  tileLayersConfig: {},
  geocodingConfig: {},
  fullscreenConfig: {},
  mouseCoordinateConfig: {},
};
