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

import { LayerLoader } from './LayerLoader';

import { useDrawEvents } from '../../../../../base';
import { GeometryEditorControl } from '../../../../layers';

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
  const [renderFlag, setRenderFlag] = useState(null);
  const [controlRendered, setControlRendered] = useState(false);

  // Configurations
  const { uniqueLayer } = geometryEditorConfig;

  // Auxiliary functions
  const renderFlagGenerator = (id) => {
    uniqueLayer ? setRenderFlag(id) : null;
  };

  // Handlers
  const mapEventHandler = new MapEventHandler(
    geometryStore,
    renderFlagGenerator,
    geometryEditorConfig
  );

  // Hooks
  useDrawEvents(mapEventHandler, () => setControlRendered(true));

  // Checking if the current store is already populated.
  if (!geometryStore.isEmpty() && renderFlag === null) {
    setRenderFlag(geometryStore.indexKey);
  }

  return (
    <>
      {controlRendered ? (
        <>
          <GeometryEditorControl {...geometryEditorConfig} />
          <LayerLoader
            renderFlag={renderFlag}
            layers={geometryStore.getLayers()}
            enableMultipleLayers={!geometryEditorConfig.uniqueLayer}
          />
        </>
      ) : null}
    </>
  );
};

GeometryEditor.propTypes = {
  geometryStore: PropTypes.object.isRequired,
  geometryEditorConfig: PropTypes.shape({
    toolbarConfig: PropTypes.object.isRequired,
    uniqueLayer: PropTypes.bool.isRequired,
  }),
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
    uniqueLayer: false,
  },
};
