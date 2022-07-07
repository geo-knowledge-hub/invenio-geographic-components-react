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

import { Button, Icon } from 'semantic-ui-react';

import { LocationsField as LocationsFieldComponent } from './LocationsField';

export default {
  title: 'Form/Field/Locations/Locations Field',
  component: LocationsFieldComponent,
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
      <LocationsFieldComponent {...args} />
    </Formik>

    <SemanticToastContainer />
  </>
);

/**
 * Component stories
 */
export const Basic = Template.bind({});
Basic.args = {
  action: 'add',
  onLocationChange: (changedLocation) => {},
  addLabel: 'Add location',
  editLabel: 'Edit location',
  initialLocation: {},
  trigger: (
    <Button type={'button'} icon labelPosition={'left'}>
      <Icon name={'add'} /> {'Add location'}
    </Button>
  ),
  interactiveMapConfig: {},
};
