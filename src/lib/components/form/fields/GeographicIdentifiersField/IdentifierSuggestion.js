/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Header, Label } from 'semantic-ui-react';

import { i18next } from '@translations/i18next';

import { describe, summarize } from '../../../geoidentifiers';

/**
 * Identifiers suggestion item.
 *
 * @constructor
 *
 * @param {Object} record Geographic Identifiers record.
 * @returns {JSX.Element}
 */
export const IdentifierSuggestion = ({ record }) => {
  const { name, population } = summarize(record);
  const description = describe(record);

  return (
    <Header as={'h5'} className={'geographic-identifier-suggestion'}>
      {name}
      {population && (
        <Label size={'mini'}>
          {i18next.t('Population {{population}}', { population })}
        </Label>
      )}
      {description && <Header.Subheader>{description}</Header.Subheader>}
    </Header>
  );
};

IdentifierSuggestion.propTypes = {
  record: PropTypes.object.isRequired,
};
