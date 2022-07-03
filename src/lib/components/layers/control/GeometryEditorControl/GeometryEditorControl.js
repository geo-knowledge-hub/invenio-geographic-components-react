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

import { DrawEventAssigner, isPropertyDefined } from '../../../../base';

/**
 * Geometry Editor control
 * @constructor
 *
 * @param {Object} editorConfig Configuration object.
 * @returns {JSX.Element}
 */
export const GeometryEditorControl = ({ editorConfig }) => {
  // hooks
  const mapContext = useMap();

  useEffect(() => {
    // Defining the map level events (e.g., `pm:create` and `pm:cut`).

    /**
     * Assigning create event.
     */
    DrawEventAssigner.assignMapDrawEvents(mapContext, editorConfig);

    /**
     * Configuring the geoman toolbox
     */
    if (isPropertyDefined(editorConfig, 'toolbarConfig')) {
      mapContext.pm.addControls(editorConfig.toolbarConfig);
    }

    if (isPropertyDefined(editorConfig, 'controlOrder')) {
      mapContext.pm.Toolbar.changeControlOrder(editorConfig.controlOrder);
    }
  }, []); // avoiding re-rendering

  return null;
};

GeometryEditorControl.propTypes = {
  onCreate: PropTypes.func,
  onCut: PropTypes.func,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  toolbarConfig: PropTypes.shape({
    toolbarConfig: PropTypes.object,
    controlOrder: PropTypes.array,
  }),
};

GeometryEditorControl.defaultProps = {
  toolbarConfig: {},
};
