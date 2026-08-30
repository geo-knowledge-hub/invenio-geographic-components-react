/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { AccordionField } from 'react-invenio-forms';

import { i18next } from '@translations/i18next';

import { WATERMARK_POSITIONS } from '../../../components/layers';
import { LocationsField } from '../../../components/form/fields/LocationsField';

/**
 * Deposit form section holding the locations field.
 *
 * @constructor
 *
 * @param {String} fieldPath Path where the locations are stored in the Formik data.
 * @param {String} label Section title.
 * @param {String} id DOM id of the section, used by the form error summary to link to it.
 * @param {Boolean} active Flag to set if the section starts open.
 * @param {Array.<String>} includesPaths Formik paths whose errors this section reports.
 *                                       Defaults to the path the field writes to.
 * @param {Object} severityChecks Labels for the error counts, as the instance defines them.
 * @param {Object} locationsConfig Remaining properties, passed to the `LocationsField`.
 * @returns {JSX.Element}
 */
export const LocationsAccordion = ({
  fieldPath,
  label,
  id,
  active,
  includesPaths,
  severityChecks,
  ...locationsConfig
}) => (
  <AccordionField
    id={id}
    label={label}
    active={active}
    severityChecks={severityChecks}
    includesPaths={includesPaths || [fieldPath]}
  >
    <LocationsField fieldPath={fieldPath} {...locationsConfig} />
  </AccordionField>
);

LocationsAccordion.propTypes = {
  fieldPath: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  active: PropTypes.bool,
  includesPaths: PropTypes.arrayOf(PropTypes.string),
  severityChecks: PropTypes.object,
  watermarkPosition: PropTypes.oneOf(WATERMARK_POSITIONS),
  identifiersConfig: PropTypes.object,
};

LocationsAccordion.defaultProps = {
  fieldPath: 'metadata.locations.features',
  label: i18next.t('Geographic Locations'),
  id: 'locations-section',
  active: true,
  includesPaths: null,
  severityChecks: null,
};
