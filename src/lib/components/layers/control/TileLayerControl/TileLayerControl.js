/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { LayersControl, TileLayer } from 'react-leaflet';

/**
 * @typedef TileLayerObject
 * @type {Object}
 * @property {string} baseLayer Leaflet.LayersControl.BaseLayer options
 * @property {string} tileLayer TileLayer title
 */

/**
 * Default tile layers used in the TileLayerControl component.
 *
 * @type Array.<TileLayerObject>
 */
export const DefaultTileLayers = [
  {
    baseLayer: {
      checked: true,
      name: 'Open Street Map',
    },
    tileLayer: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
      maxNativeZoom: 19,
    },
  },
  {
    baseLayer: {
      name: 'Esri World Imagery',
    },
    tileLayer: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution:
        'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
  },
  {
    baseLayer: {
      name: 'OpenTopoMap',
    },
    tileLayer: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      maxZoom: 17,
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    },
  },
];

/**
 * Tile Layer control. This controller enables users to define multiple Tile Layer at once.
 * @constructor
 *
 * @param {Array.<TileLayerObject>} tileLayers
 * @param layersControlConfig
 * @returns {JSX.Element}
 *
 * @note Maybe, this component can be generated to accept not only
 *       tile layers, but other types of layers.
 */
export const TileLayerControl = ({ tileLayers, layersControlConfig }) => (
  <LayersControl {...layersControlConfig}>
    {tileLayers.map((tileLayer, index) => (
      <LayersControl.BaseLayer key={index} {...tileLayer.baseLayer}>
        <TileLayer {...tileLayer.tileLayer} />
      </LayersControl.BaseLayer>
    ))}
  </LayersControl>
);

TileLayerControl.propTypes = {
  tileLayers: PropTypes.arrayOf(
    PropTypes.shape({
      baseLayer: PropTypes.object.isRequired,
      tileLayer: PropTypes.object.isRequired,
    })
  ),
  layersControlConfig: PropTypes.object,
};

TileLayerControl.defaultProps = {
  tileLayers: DefaultTileLayers,
  layersControlConfig: {},
};
