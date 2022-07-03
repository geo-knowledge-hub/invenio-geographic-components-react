/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

import _assign from 'lodash/assign';

import { MapEventHandler } from './MapEventHandler';

import {
  EditableGeoJSONLayer,
  GeometryEditorControl,
} from '../../../../layers';

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
  // Configuring the event handler
  const mapEventHandler = _assign(
    new MapEventHandler(geometryStore),
    geometryEditorConfig
  );

  return (
    <>
      <GeometryEditorControl editorConfig={mapEventHandler} />
      <EditableGeoJSONLayer
        geoJsonData={geometryStore.getGeometries()}
        eventProvider={mapEventHandler}
      />
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
