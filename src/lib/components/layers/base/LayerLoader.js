/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useLeafletContext } from '@react-leaflet/core';

/**
 * Component to load multiple layers on a Leaflet Container (`Layer` or `Map` instance).
 * @constructor
 *
 * @param {Array} layers Array of `Leaflet.Layer` to be added in the `Container`.
 *
 * @returns {JSX.Element}
 */
export const LayerLoader = ({ layers }) => {
  const context = useLeafletContext();

  useEffect(() => {
    const container = context.layerContainer || context.map;

    layers.forEach((layer) => layer.addTo(container));
  }, [context]);

  return null;
};

LayerLoader.propTypes = {
  layers: PropTypes.array.isRequired,
};

LayerLoader.defaultProps = {};
