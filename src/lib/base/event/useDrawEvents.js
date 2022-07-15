/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useMap } from 'react-leaflet';
import { DrawEventAssigner } from './DrawEventAssigner';

/**
 * Hook to enable the draw events in the map.
 *
 * @param {Object} eventsConfig Configuration object for the `DrawEventAssigner`.
 * @param {Function} onDefined Function callback called when all events are signed in the Leaflet map.
 * @returns {JSX.Element}
 */
export const useDrawEvents = (eventsConfig, onDefined) => {
  // hooks
  const mapContext = useMap();

  useEffect(() => {
    // Defining the map level events (e.g., `pm:create` and `pm:cut`).

    // Assigning create event.
    DrawEventAssigner.assignMapDrawEvents(mapContext, eventsConfig);

    // Side effecting
    if (onDefined) {
      onDefined();
    }
  }, []); // avoiding re-rendering

  return null;
};

useDrawEvents.propTypes = {
  editorConfig: PropTypes.shape({
    onCreate: PropTypes.func,
    onCut: PropTypes.func,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
  }).isRequired,
  onDefined: PropTypes.func,
};

useDrawEvents.defaultProps = {
  editorConfig: {},
  onDefined: null,
};
