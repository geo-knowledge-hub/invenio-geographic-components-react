/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import hash from 'object-hash';

import { MapContainer } from 'react-leaflet';
import { Button, Menu, Modal, Message } from 'semantic-ui-react';

import { i18next } from '@translations/i18next';

import { MenuContextProvider } from './SimplificationMenuContext';

import { BaseMapLayers, GeoJSONLayer } from '../../layers';

import {
  DisabledSimplifier,
  ConvexHullSimplifier,
  BoundingBoxSimplifier,
} from './simplifiers';

/**
 * Simplification menu component.
 * @constructor
 *
 * @param {Object} message Message to be present to the user in the menu.
 * @param {Object} data Data to be used in the operations.
 * @param {Function} dataChangeCallback Function called when the user closes the menu.
 * @param {Object} modalState State of the Modal.
 * @param {String} modalTitle Title of the modal.
 * @param {Object} mapContainerConfig Map Container configuration.
 * @param {Object} mapLayersConfig Map Layers configuration.
 *                                 For more information, please refer to the
 *                                 `BaseMapLayer` component.
 * @param {Object} modalConfig Extra configurations for the modal. For more
 *                                 information, please check the `Semantic UI`
 *                                 documentation.
 * @returns {JSX.Element}
 */
export const SimplificationMenu = ({
  message,
  data,
  dataChangeCallback,
  modalState,
  modalTitle,
  mapContainerConfig,
  mapLayersConfig,
  ...modalConfig
}) => {
  const [menuData, setMenuData] = useState(data);
  const [activeItem, setActiveItem] = useState(null);

  const closeModal = () => {
    dataChangeCallback(menuData);
    modalState.setIsOpen(false);
  };

  // Used to help GeoJSON layer re-render.
  const menuDataHash = hash(menuData);

  // Defining the button text
  const buttonText =
    activeItem === null
      ? i18next.t('Continue without simplification')
      : i18next.t('Use the selected method');

  return (
    <MenuContextProvider
      value={{
        data: {
          rawData: data,
          transformedData: menuData,
          setTransformedData: setMenuData,
        },
        menu: {
          activeItem: activeItem,
          setActiveItem: setActiveItem,
        },
      }}
    >
      <Modal open={modalState.isOpen} onClose={closeModal} {...modalConfig}>
        <Modal.Header>{modalTitle}</Modal.Header>
        <Modal.Content>
          <>
            <Message>
              <Message.Header>{message.title}</Message.Header>
              <p>{message.content}</p>
            </Message>

            <Menu>
              <Menu.Item header>
                {i18next.t('Simplification methods')}
              </Menu.Item>
              <DisabledSimplifier />
              <ConvexHullSimplifier />
              <BoundingBoxSimplifier />
            </Menu>

            <MapContainer {...mapContainerConfig}>
              <BaseMapLayers {...mapLayersConfig} />

              <GeoJSONLayer key={menuDataHash} geoJsonData={menuData} />
            </MapContainer>
          </>
        </Modal.Content>
        <Modal.Actions>
          <Button
            content={buttonText}
            labelPosition={'right'}
            icon={'checkmark'}
            onClick={closeModal}
            positive
          />
        </Modal.Actions>
      </Modal>
    </MenuContextProvider>
  );
};

SimplificationMenu.propTypes = {
  message: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }),
  data: PropTypes.object.isRequired,
  dataChangeCallback: PropTypes.func.isRequired,
  modalState: PropTypes.object.isRequired,
  modalTitle: PropTypes.string,
  mapContainerConfig: PropTypes.object,
};

SimplificationMenu.defaultProps = {
  message: {
    title: i18next.t('Geometry simplification'),
    content: i18next.t(
      'If you have complex geometries, we ' +
        'recommend simplifying them using the methods below'
    ),
  },
  modalTitle: i18next.t('Simplification menu'),
  mapContainerConfig: {
    zoom: 1,
    center: [30, -50], // is updated when the data is defined in the map.
    zoomControl: true,
  },
  closeIcon: true,
  closeOnDimmerClick: false,
  size: 'small',
  centered: false,
};
