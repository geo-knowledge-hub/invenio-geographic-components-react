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

/**
 * Geometry Editor control
 * @constructor
 *
 * @param {Object} editorConfig Configuration object.
 * @returns {JSX.Element}
 */
export const GeometryEditorControl = ({ toolbarConfig, controlOrder }) => {
  // hooks
  const mapContext = useMap();

  useEffect(() => {
    // Defining the map level events (e.g., `pm:create` and `pm:cut`).

    // Configuring the geoman toolbox
    if (toolbarConfig) {
      mapContext.pm.addControls(toolbarConfig);
    }

    if (controlOrder) {
      mapContext.pm.Toolbar.changeControlOrder(controlOrder);
    }
  }, []); // avoiding re-rendering

  return null;
};

GeometryEditorControl.propTypes = {
  toolbarConfig: PropTypes.object,
  controlOrder: PropTypes.array,
};

GeometryEditorControl.defaultProps = {
  toolbarConfig: {},
  controlOrder: [],
};
