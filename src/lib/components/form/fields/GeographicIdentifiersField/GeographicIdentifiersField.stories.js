/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { Formik } from 'formik';
import { Form } from 'semantic-ui-react';

import geoidentifiersItem from '@tests/mock/vocabularies/geoidentifiers-item.json';
import geoidentifiersSuggest from '@tests/mock/vocabularies/geoidentifiers-suggest.json';

import { GeographicIdentifiersField as GeographicIdentifiersFieldComponent } from './GeographicIdentifiersField';

export default {
  title: 'Form/Field/Geographic Identifiers',
  component: GeographicIdentifiersFieldComponent,
};

/**
 * Mock API
 */
const mockApiConfig = [
  {
    url: '/api/geoidentifiers?size=&suggest=',
    method: 'GET',
    status: 200,
    response: () => geoidentifiersSuggest,
  },
  {
    url: `/api/geoidentifiers/${encodeURIComponent(geoidentifiersItem.id)}`,
    method: 'GET',
    status: 200,
    response: () => geoidentifiersItem,
  },
];

/**
 * Component template
 */
const Template = ({ initialValues, ...args }) => (
  <Formik initialValues={initialValues}>
    <Form>
      <GeographicIdentifiersFieldComponent {...args} />
    </Form>
  </Formik>
);

/**
 * Component stories
 */
export const Basic = Template.bind({});
Basic.args = {
  initialValues: { identifiers: [] },
};
Basic.parameters = { mockData: mockApiConfig };

/**
 * With a place already chosen, as when an existing location is edited: the
 * record stores a reference, and the field reads back what it stands for.
 */
export const WithInitialValues = Template.bind({});
WithInitialValues.args = {
  initialValues: {
    identifiers: [{ scheme: 'geonames', identifier: geoidentifiersItem.id }],
  },
};
WithInitialValues.parameters = { mockData: mockApiConfig };

/**
 * With somewhere for a chosen place to be put. The map itself lives in the
 * `Locations` modal. Here the action only reports the geometry it would hand
 * over.
 */
export const WithMap = Template.bind({});
WithMap.args = {
  initialValues: { identifiers: [] },
  onAddGeometry: (geometry) => {},
};
WithMap.parameters = { mockData: mockApiConfig };

/**
 * With a vocabulary that answers with nothing.
 */
export const NoResults = Template.bind({});
NoResults.args = {
  initialValues: { identifiers: [] },
};
NoResults.parameters = {
  mockData: [
    {
      url: '/api/geoidentifiers?size=&suggest=',
      method: 'GET',
      status: 200,
      response: () => ({ hits: { hits: [], total: 0 } }),
    },
  ],
};
