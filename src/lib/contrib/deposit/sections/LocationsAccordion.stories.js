/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { Formik } from 'formik';

import { Global } from '@emotion/react';
import { SemanticToastContainer } from 'react-semantic-toasts';

import geonamesData from '@tests/mock/vocabularies/geoidentifiers-suggest.json';

import { LocationsAccordion as LocationsAccordionComponent } from './LocationsAccordion';

export default {
  title: 'Contrib/Deposit/Locations Accordion',
  component: LocationsAccordionComponent,
};

/**
 * Mock API
 */
const mockApiConfig = [
  {
    url: '/api/geoidentifiers?size=&suggest=',
    method: 'GET',
    status: 200,
    response: () => geonamesData,
  },
];

/**
 * Component template
 */
const Template = ({ initialErrors, ...args }) => (
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
      initialValues={{ metadata: { locations: { features: [] } } }}
      initialErrors={initialErrors}
    >
      <LocationsAccordionComponent {...args} />
    </Formik>

    <SemanticToastContainer />
  </>
);

/**
 * Component stories
 */
export const Basic = Template.bind({});
Basic.args = {
  geometryTypes: ['Point', 'Polygon'],
};

Basic.parameters = {
  mockData: mockApiConfig,
};

/**
 * The section as the deposit form shows it once a location fails to validate.
 */
export const WithError = Template.bind({});
WithError.args = {
  ...Basic.args,
  initialErrors: {
    metadata: { locations: { features: 'Not a valid location.' } },
  },
};

WithError.parameters = {
  mockData: mockApiConfig,
};

/**
 * The section with the Leaflet watermark moved out of the way. Open a location
 * and draw one to see the map
 */
export const WithWatermarkMoved = Template.bind({});
WithWatermarkMoved.args = {
  ...Basic.args,
  watermarkPosition: 'topright',
};

WithWatermarkMoved.parameters = {
  mockData: mockApiConfig,
};

/**
 * The section with no watermark at all
 */
export const WithoutWatermark = Template.bind({});
WithoutWatermark.args = {
  ...Basic.args,
  watermarkPosition: null,
};

WithoutWatermark.parameters = {
  mockData: mockApiConfig,
};
