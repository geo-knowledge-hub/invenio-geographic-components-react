/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import hash from 'object-hash';

import { GeometryLoader } from '../../geometry';
import { SimplificationMenu } from '../../geometry';

/**
 * Import Geometry data manager.
 * @constructor
 *
 * @param {Function} onImport Function called when the data load is finished.
 * @param {Function} onError Function called when the data load has errors.
 * @param {Object} geometryLoaderConfig Configuration object for the `GeometryLoader` component.
 * @param {Object} simplificationMenuConfig Configuration object for the `SimplificationMenu` component.
 * @returns {JSX.Element}
 */
export const ImportManager = ({
  onImport,
  onError,
  geometryLoaderConfig,
  simplificationMenuConfig,
}) => {
  // States
  const [importedData, setImportedData] = useState({ data: {}, errors: [] });
  const [isSimplificationMenuOpen, setIsSimplificationMenuOpen] =
    useState(false);

  // Handlers
  const handleDataImport = (data) => {
    if (data.errors.length > 0) {
      onError(data);
    }

    setImportedData(data);
    setIsSimplificationMenuOpen(true);
  };
  const handleDataSimplification = (data) => onImport(data);

  // Utilities
  const importedDataHash = hash(importedData);

  return (
    <>
      <GeometryLoader
        uploadCallback={handleDataImport}
        {...geometryLoaderConfig}
      />

      <SimplificationMenu
        key={importedDataHash}
        modalState={{
          isOpen: isSimplificationMenuOpen,
          setIsOpen: setIsSimplificationMenuOpen,
        }}
        data={importedData.data}
        dataChangeCallback={handleDataSimplification}
        {...simplificationMenuConfig}
      />
    </>
  );
};

ImportManager.propTypes = {
  onImport: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  geometryLoaderConfig: PropTypes.object,
  simplificationMenuConfig: PropTypes.object,
};

ImportManager.defaultProps = {};
