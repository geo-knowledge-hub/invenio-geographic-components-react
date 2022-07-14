/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { Global } from '@emotion/react';

import { GeographicMetadataLocationViewer as GeographicMetadataLocationViewerComponent } from './GeographicMetadataLocationViewer';

export default {
  title: 'Contrib/Landing Page/Viewer/Geographic Metadata Locations',
  component: GeographicMetadataLocationViewerComponent,
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
    <GeographicMetadataLocationViewerComponent {...args} />
  </>
);

/**
 * Components data
 */

const featureData = [
  {
    description: 'Place description',
    geometry: {
      coordinates: [
        [
          [-99.492188, -45.054125],
          [-99.492188, 25.932837],
          [-8.789063, 25.932837],
          [-8.789063, -45.054125],
          [-99.492188, -45.054125],
        ],
      ],
      type: 'Polygon',
    },
    place: 'Place title',
  },
  {
    description: 'Place description (2)',
    geometry: {
      coordinates: [
        [
          [-50.4931640625, -19.476950206488414],
          [-60.6005859375, -14.093957177836224],
          [-57.74414062500001, -5.7908968128719565],
          [-50.9326171875, -3.162455530237848],
          [-50.4931640625, -19.476950206488414],
        ],
      ],
      type: 'Polygon',
    },
    identifiers: [
      {
        identifier: 'geonames::3039182',
        scheme: 'geonames',
      },
    ],
    place: 'Place title (2)',
  },
];

/**
 * Component stories
 */

export const Basic = Template.bind({});
Basic.args = {
  featuresData: featureData,
};
