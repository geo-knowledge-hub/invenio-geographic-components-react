/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';

import L from 'leaflet';
import { useMap } from 'react-leaflet';

/**
 * Corners a Leaflet control can be put in.
 *
 * @type Array.<String>
 */
export const WATERMARK_POSITIONS = [
  'topleft',
  'topright',
  'bottomleft',
  'bottomright',
];

/**
 * @constructor
 * Watermark control.
 *
 * @param {String|null} position Corner the watermark is put in. `null` takes it
 *                               away, and leaving it out keeps whatever the map
 *                               was built with.
 * @returns {null} Nothing is rendered: the badge is a Leaflet control.
 */
export const WatermarkControl = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    // Left out means the caller has no opinion, so the map keeps what it was
    // built with
    if (position === undefined) {
      return undefined;
    }

    // Moving the badge where it stands is not enough: a control taken off the
    // map keeps the corner it is given and never goes back up. So it is always
    // taken away and put up again
    if (map.attributionControl) {
      map.removeControl(map.attributionControl);
    }

    if (position === null) {
      return undefined;
    }

    // A new badge reads the attributions of the layers already on the map, and
    // follows the ones added afterwards, so nothing is lost by replacing it
    const control = L.control.attribution({ position }).addTo(map);

    return () => map.removeControl(control);
  }, [map, position]);

  return null;
};

WatermarkControl.propTypes = {
  position: PropTypes.oneOf(WATERMARK_POSITIONS),
};
