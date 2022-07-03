/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { GeometryLoader as GeometryLoaderComponent } from './GeometryLoader';

export default {
  title: 'Data/Geometry Loader',
  component: GeometryLoaderComponent,
};

/**
 * Component template
 */
const Template = (args) => (
  <>
    <GeometryLoaderComponent {...args} />
  </>
);

/**
 * Component stories
 */
export const TextDropdown = Template.bind({});
TextDropdown.args = {
  uploadCallback: (data) => {
    console.log('Data loaded!');
    console.log(data);
  },
  dropdownConfig: {
    text: 'Import data',
  },
};

export const ButtonDropdown = Template.bind({});
ButtonDropdown.args = {
  uploadCallback: (data) => {
    console.log('Data loaded!');
    console.log(data);
  },
  dropdownConfig: {
    text: 'Import data',
    button: true,
  },
};
