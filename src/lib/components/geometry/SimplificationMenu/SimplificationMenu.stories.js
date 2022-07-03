/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from 'react';
import { Global } from '@emotion/react';

import { Button } from 'semantic-ui-react';

import { SimplificationMenu as SimplificationMenuComponent } from './SimplificationMenu';

import brazilLinestringData from '@tests/mock/spatial/brazil-line';

export default {
  title: 'Data/Geometry Simplification Menu',
  component: SimplificationMenuComponent,
};

/**
 * Component template
 */
const Template = (args) => {
  const [modalOpen, setModalOpen] = useState(false);

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

      <Button
        onClick={() => {
          console.log('clicked');
          setModalOpen(true);
        }}
      >
        Open modal
      </Button>
      <SimplificationMenuComponent
        onImport={(data) => {
          console.log('simplified!');
        }}
        modalState={{
          isOpen: modalOpen,
          setIsOpen: setModalOpen,
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
  data: brazilLinestringData,
  dataChangeCallback: (data) => {},
};
