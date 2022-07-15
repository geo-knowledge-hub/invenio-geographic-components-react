/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { MapEventHandler } from './MapEventHandler';

import { useDrawEvents } from '../../../../../base';
import { GeometryEditorControl, LayerLoader } from '../../../../layers';

/**
 * Geometry editor component.
 * @constructor
 *
 * @param {Object} geometryStore Geometry Store object initialized.
 * @param {Object} geometryEditorConfig Configuration object for the
 *                                      `GeometryEditorControl`.
 * @returns {JSX.Element}
 */
export const GeometryEditor = ({ geometryStore, geometryEditorConfig }) => {
  // States
  const [controlRendered, setControlRendered] = useState(false);

  // Handlers
  const mapEventHandler = new MapEventHandler(geometryStore);

  // Hooks
  useDrawEvents(mapEventHandler, () => setControlRendered(true));

  return (
    <>
      {controlRendered ? (
        <>
          <GeometryEditorControl {...geometryEditorConfig} />
          <LayerLoader layers={geometryStore.getLayers()} />
        </>
      ) : null}
    </>
  );
};

GeometryEditor.propTypes = {
  geometryStore: PropTypes.object.isRequired,
  geometryEditorConfig: PropTypes.object,
};

GeometryEditor.defaultProps = {
  geometryEditorConfig: {
    toolbarConfig: {
      positions: {
        draw: 'topleft',
        edit: 'topright',
      },
      drawText: false,
      drawCircleMarker: false,
      drawCircle: false,
      cutPolygon: false, // temporary
      controlOrder: [
        'drawMarker',
        'drawPolyline',
        'drawRectangle',
        'drawPolygon',
        'editMode',
        'dragMode',
        'cutPolygon',
        'rotateMode',
        'removalMode',
      ],
    },
  },
};
