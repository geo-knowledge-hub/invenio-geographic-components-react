/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import L from 'leaflet';
import './base.css';

/**
 * MouseCoordinate plugin for Leaflet.
 *
 * @note This plugin was adapted from the `Michal Zimmermann` implementation (`Leaflet Coordinates Control`). We
 *       import the entire source code to avoid extra dependencies in the project.
 * @see https://github.com/zimmicz/Leaflet-Coordinates-Control
 */
L.Control.MouseCoordinate = L.Control.extend({
  options: {
    position: 'bottomleft',
    separator: ' | ',
    latitudeFirst: false,
    decimalPrecision: 3,
    formatter: {
      latitude: null,
      longitude: null,
    },
    prefix: '',
  },
  onAdd: function (map) {
    this._container = L.DomUtil.create(
      'div',
      'leaflet-mouse-coordinate-control'
    );
    L.DomEvent.disableClickPropagation(this._container);

    map.on('mousemove', this._onMouseMove, this);

    this._container.innerHTML = ' ';
    return this._container;
  },
  onRemove: function (map) {
    map.off('mousemove', this._onMouseMove);
  },
  _onMouseMove: function (e) {
    const applyFormatter = (formatter, value) => {
      if (formatter) {
        return formatter(value);
      }
      return L.Util.formatNum(value, this.options.decimalPrecision);
    };

    let position = e.latlng;
    let positionLatitude = position.lat;
    let positionLongitude = position.lng;

    if (this.options.formatter) {
      const formatter = this.options.formatter;

      positionLatitude = applyFormatter(formatter.latitude, positionLatitude);
      positionLongitude = applyFormatter(
        formatter.longitude,
        positionLongitude
      );
    }

    const positionValue = this.options.latitudeFirst
      ? `${positionLatitude}${this.options.separator}${positionLongitude}`
      : `${positionLongitude}${this.options.separator}${positionLatitude}`;

    this._container.innerHTML = `${this.options.prefix} ${positionValue}`;
  },
});

/**
 * Factory
 */
L.Control.mouseCoordinate = function (options) {
  return new L.Control.MouseCoordinate(options);
};
