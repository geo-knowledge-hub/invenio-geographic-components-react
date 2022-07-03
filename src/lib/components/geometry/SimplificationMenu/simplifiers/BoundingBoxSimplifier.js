/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { Menu } from 'semantic-ui-react';

import { i18next } from '@translations/i18next';

import { GeometryOperator } from '../../../../base';
import { MenuContext } from '../SimplificationMenuContext';

/**
 * Bounding box simplifier method.
 * @constructor
 *
 * @param {String} simplifierName Simplifier name presented in the interface.
 * @returns {JSX.Element}
 */
export const BoundingBoxSimplifier = ({ simplifierName }) => {
  const simplifierId = 'bbox';
  const menuContext = useContext(MenuContext);

  const processData = () => {
    // processing data
    if (!(menuContext.menu.activeItem === simplifierId)) {
      menuContext.data.setTransformedData(
        GeometryOperator.boundingBox(menuContext.data.rawData)
      );
    }

    menuContext.menu.setActiveItem(simplifierId);
  };

  return (
    <Menu.Item
      name={simplifierId}
      content={simplifierName}
      active={menuContext.menu.activeItem === simplifierId}
      onClick={processData}
    />
  );
};

BoundingBoxSimplifier.propTypes = {
  simplifierName: PropTypes.string,
};

BoundingBoxSimplifier.defaultProps = {
  simplifierName: i18next.t('Bounding box'),
};
