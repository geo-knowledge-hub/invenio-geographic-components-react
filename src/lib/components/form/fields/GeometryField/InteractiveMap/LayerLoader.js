/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import _last from 'lodash/last';

import { useLeafletContext } from '@react-leaflet/core';

/**
 * Component to load multiple layers on a Leaflet Container (`Layer` or `Map` instance).
 * @constructor
 *
 * @param {Array} layers Array of `Leaflet.Layer` to be added in the `Container`.
 * @param {Number} renderFlag Flag to mark the current render step.
 * @param {Boolean} enableMultipleLayers Flag to enable/disable the multiple layer usage.
 *
 * @returns {JSX.Element}
 */
export const LayerLoader = ({ layers, renderFlag, enableMultipleLayers }) => {
  const context = useLeafletContext();
  const renderFlagRef = useRef(null);

  // ToDo: Review if the "multi effect" approach is a good solution.
  if (enableMultipleLayers) {
    useEffect(() => {
      const container = context.map;

      layers.forEach((layer) => layer.addTo(container));

      return () => {
        layers.forEach((layer) => container.removeLayer(layer));
      };
    }, []);
  } else {
    useEffect(() => {
      const container = context.map;

      if (renderFlagRef.current === renderFlag) {
        return;
      }

      // Removing all drawn layers in the map
      const drawedLayers = container.pm.getGeomanDrawLayers();

      drawedLayers.forEach((layer) => {
        container.removeLayer(layer);
      });

      // Selecting one layer to draw in the map
      const layerToDraw = _last(layers);

      if (layerToDraw) {
        layerToDraw.addTo(container);

        renderFlagRef.current = renderFlag;

        return () => {
          container.removeLayer(layerToDraw);
        };
      }
    }, [renderFlag]);
  }

  return null;
};

LayerLoader.propTypes = {
  layers: PropTypes.array.isRequired,
  renderFlag: PropTypes.number,
  enableMultipleLayers: PropTypes.bool.isRequired,
};

LayerLoader.defaultProps = {};
