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
 * @param {Boolean} useTileLayers Flag to enable/disable the `Tile Layer Control`;
 * @param {Boolean} useGeocoding Flag to enable/disable the `Geocoding Control`;
 * @param {Boolean} useFullscreen Flag to enable/disable the `Fullscreen Control`;
 * @param {Boolean} useMouseCoordinate Flag to enable/disble the `Mouse Coordinate Control`;
 * @param {Object} layersConfig Configuration object for the following layers:
 *                              - TileLayerControl (`tileLayersConfig`);
 *                              - GeocodingControl (`geocodingConfig`);
 *                              - FullscreenControl (`fullscreenConfig`);
 *                              - MouseCoordinateControl (`mouseCoordinateConfig`).
 *
 * @returns {JSX.Element}
 */
export const BaseMapLayers = ({
  useTileLayers,
  useGeocoding,
  useFullscreen,
  useMouseCoordinate,
  ...layersConfig
}) => {
  const baseLayersDefinition = [
    {
      enable: useTileLayers,
      render: (key) => (
        <TileLayerControl key={key} {...layersConfig.tileLayersConfig} />
      ),
    },
    {
      enable: useGeocoding,
      render: (key) => (
        <GeocodingControl key={key} {...layersConfig.geocodingConfig} />
      ),
    },
    {
      enable: useFullscreen,
      render: (key) => (
        <FullscreenControl key={key} {...layersConfig.fullscreenConfig} />
      ),
    },
    {
      enable: useMouseCoordinate,
      render: (key) => (
        <MouseCoordinateControl
          key={key}
          {...layersConfig.mouseCoordinateConfig}
        />
      ),
    },
  ];

  return (
    <>
      {baseLayersDefinition.map((layerDefinition, index) => {
        if (layerDefinition.enable) {
          return layerDefinition.render(index);
        }
      })}
    </>
  );
};

BaseMapLayers.propTypes = {
  useTileLayers: PropTypes.bool,
  useGeocoding: PropTypes.bool,
  useFullscreen: PropTypes.bool,
  useMouseCoordinate: PropTypes.bool,
  tileLayersConfig: PropTypes.object,
  geocodingConfig: PropTypes.object,
  fullscreenConfig: PropTypes.object,
  mouseCoordinateConfig: PropTypes.object,
};

BaseMapLayers.defaultProps = {
  useTileLayers: true,
  useGeocoding: true,
  useFullscreen: true,
  useMouseCoordinate: true,
  tileLayersConfig: {},
  geocodingConfig: {},
  fullscreenConfig: {},
  mouseCoordinateConfig: {},
};
