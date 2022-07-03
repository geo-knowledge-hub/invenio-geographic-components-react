/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Dropdown } from 'semantic-ui-react';

import { i18next } from '@translations/i18next';

/**
 * Web Feature Service Loader.
 * @constructor
 *
 * @param {Function} onImport Function called after the data is loaded.
 * @param {Object} dropdownItemConfig Options to configure the Semantic-UI
 *                                    Dropdown.Item generated for this loader.
 *
 * @returns {JSX.Element}
 *
 * @todo To be implemented.
 *
 * @see https://react.semantic-ui.com/modules/dropdown/
 */
export const WebFeatureServiceLoader = ({ onImport, dropdownItemConfig }) => {
  return (
    <Dropdown.Item disabled={true} {...dropdownItemConfig}>
      {i18next.t('Web Feature Service')}
    </Dropdown.Item>
  );
};

WebFeatureServiceLoader.propTypes = {
  onImport: PropTypes.func.isRequired,
  dropdownItemConfig: PropTypes.object,
};

WebFeatureServiceLoader.defaultProps = {};
