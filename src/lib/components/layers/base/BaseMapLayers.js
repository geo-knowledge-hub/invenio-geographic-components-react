/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

// Leaflet stylesheet and default marker icons
import '../../../base/leaflet';

// Imported from the leaf modules
import { TileLayerControl } from '../control/TileLayerControl';
import { GeocodingControl } from '../control/GeocodingControl';
import { FullscreenControl } from '../control/FullscreenControl';
import { MouseCoordinateControl } from '../control/MouseCoordinateControl';
import {
  WatermarkControl,
  WATERMARK_POSITIONS,
} from '../control/WatermarkControl';

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
 * - Mouse Coordinate Control;
 * - Watermark Control.
 *
 * @param {Boolean} useTileLayers Flag to enable/disable the `Tile Layer Control`;
 * @param {Boolean} useGeocoding Flag to enable/disable the `Geocoding Control`;
 * @param {Boolean} useFullscreen Flag to enable/disable the `Fullscreen Control`;
 * @param {Boolean} useMouseCoordinate Flag to enable/disble the `Mouse Coordinate Control`;
 * @param {String|null} watermarkPosition Corner the Leaflet watermark is put in. `null`
 *                                        takes it away, and leaving it out keeps whatever
 *                                        the map was built with;
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
  watermarkPosition,
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

      {/*
        Always rendered: the map builds the watermark on its own, so taking it
        away is work too, and a flag that stops rendering would never do it
      */}
      <WatermarkControl position={watermarkPosition} />
    </>
  );
};

BaseMapLayers.propTypes = {
  useTileLayers: PropTypes.bool,
  useGeocoding: PropTypes.bool,
  useFullscreen: PropTypes.bool,
  useMouseCoordinate: PropTypes.bool,
  watermarkPosition: PropTypes.oneOf(WATERMARK_POSITIONS),
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
