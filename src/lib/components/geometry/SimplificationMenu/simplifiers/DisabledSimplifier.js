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
import { MenuContext } from '../SimplificationMenuContext';

/**
 * Disabled simplifier representation.
 * @constructor
 *
 * @param {String} simplifierName Simplifier name presented in the interface.
 * @returns {JSX.Element}
 */
export const DisabledSimplifier = ({ simplifierName }) => {
  const simplifierId = null;
  const menuContext = useContext(MenuContext);

  const resetData = () => {
    // processing data
    menuContext.data.setTransformedData(menuContext.data.rawData);
    menuContext.menu.setActiveItem(simplifierId);
  };

  return (
    <Menu.Item
      name={simplifierId}
      content={simplifierName}
      active={menuContext.menu.activeItem === simplifierId}
      onClick={resetData}
    />
  );
};

DisabledSimplifier.propTypes = {
  simplifierName: PropTypes.string,
};

DisabledSimplifier.defaultProps = {
  simplifierName: i18next.t('Disable'),
};
