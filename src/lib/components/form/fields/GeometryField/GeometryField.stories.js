/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { Formik } from 'formik';

import { Global } from '@emotion/react';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';

import { GeometryField as GeometryFieldComponent } from './GeometryField';

export default {
  title: 'Form/Field/Geometry Field',
  component: GeometryFieldComponent,
};

/**
 * Component template
 */
const Template = (args) => (
  <>
    <Global
      styles={{
        '.leaflet-container': {
          height: '40vh',
          zIndex: 0,
        },
      }}
    />

    <Formik
      initialValues={{
        geometry: {},
      }}
    >
      <GeometryFieldComponent {...args} />
    </Formik>

    <SemanticToastContainer />
  </>
);

/**
 * Component stories
 */
export const MultipleLayers = Template.bind({});
MultipleLayers.args = {
  fieldPath: 'geometry',
  label: 'Geometry',
  labelIcon: 'location arrow',
  onDataClean: () => {
    setTimeout((_) => {
      toast({
        title: 'Data cleaned',
        description: 'Data has been cleaned',
        type: 'info',
        icon: 'info',
        time: 5000,
        animation: 'fade right',
      });
    }, 100);
  },
  interactiveMapConfig: {
    mapConfig: {
      mapContainer: {
        center: [30, -50],
        zoom: 1,
        zoomControl: true,
      },
      geometryEditorConfig: {
        toolbarConfig: {
          positions: {
            draw: 'topleft',
            edit: 'topright',
          },
          drawText: false,
          drawCircleMarker: false,
          drawCircle: false,
          cutPolygon: false,
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
    },
  },
};

export const UniqueGeometry = Template.bind({});
UniqueGeometry.args = {
  fieldPath: 'geometry',
  label: 'Geometry',
  labelIcon: 'location arrow',
  onDataClean: () => {
    setTimeout((_) => {
      toast({
        title: 'Data cleaned',
        description: 'Data has been cleaned',
        type: 'info',
        icon: 'info',
        time: 5000,
        animation: 'fade right',
      });
    }, 100);
  },
  interactiveMapConfig: {
    mapConfig: {
      mapContainer: {
        center: [30, -50],
        zoom: 1,
        zoomControl: true,
      },
      geometryEditorConfig: {
        toolbarConfig: {
          positions: {
            draw: 'topleft',
            edit: 'topright',
          },
          drawText: false,
          drawCircleMarker: false,
          drawCircle: false,
          cutPolygon: false,
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
        uniqueLayer: true,
      },
    },
  },
};
