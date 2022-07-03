/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from 'react';
import { Global } from '@emotion/react';

import { SemanticToastContainer, toast } from 'react-semantic-toasts';

import { ImportManager as ImportManagerComponent } from './ImportManager';

import brazilLinestringData from '@tests/mock/spatial/brazil-line';

export default {
  title: 'Data/Geometry importer',
  component: ImportManagerComponent,
};

/**
 * Component template
 */
const Template = (args) => {
  return (
    <>
      <Global
        styles={{
          '.leaflet-container': {
            height: '40vh',
            zIndex: 0,
          },
        }}
      />
      <SemanticToastContainer />
      <ImportManagerComponent
        geometryLoaderConfig={{
          dropdownConfig: {
            text: 'Load data',
            button: true,
          },
        }}
        {...args}
      />
    </>
  );
};

/**
 * Component stories
 */
export const Basic = Template.bind({});
Basic.args = {
  onImport: (data) => {
    console.log('Simplified');
    console.log(data);
  },
  onError: (data) => {
    setTimeout((_) => {
      toast({
        title: 'Data import error',
        description: 'Error to import the data',
        type: 'error',
        icon: 'alarm',
        time: 6000,
        animation: 'fade right',
      });
    }, 1000);
  },
  data: brazilLinestringData,
  dataChangeCallback: (data) => {},
};
