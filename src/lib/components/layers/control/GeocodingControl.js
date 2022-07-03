/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { createControlComponent, useLeafletContext } from '@react-leaflet/core';

import L from 'leaflet';
import PropTypes from 'prop-types';

/**
 * Geocoding Control component.
 */
export const GeocodingControl = createControlComponent(
  ({ providerName, providerOptions, geocodingOptions, events }) => {
    const context = useLeafletContext();

    const geocodingProvider = L.Control.Geocoder[providerName](providerOptions);
    const geocoder = L.Control.geocoder({
      ...geocodingOptions,
      geocoder: geocodingProvider,
    });

    // adding the user-defined events
    const eventsNames = Object.keys(events);

    eventsNames.forEach((eventName) => {
      geocoder['on'](eventName, events[eventName](context.map));
    });

    return geocoder;
  }
);

GeocodingControl.propTypes = {
  providerName: PropTypes.string.isRequired,
  providerOptions: PropTypes.object,
  geocodingOptions: PropTypes.object,
  events: PropTypes.object,
};

GeocodingControl.defaultProps = {
  providerName: 'nominatim',
  providerOptions: {},
  geocodingOptions: {
    query: '',
    placeholder: '',
    defaultMarkerGeocode: false,
  },
  events: {
    markgeocode: (mapContext) => {
      return (e) => {
        mapContext.fitBounds(e.geocode.bbox);
      };
    },
  },
};
