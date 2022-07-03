/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { FieldLabel, TextField } from 'react-invenio-forms';

import { i18next } from '@translations/i18next';

/**
 * Place Formik field.
 * @constructor
 *
 * @param {String} fieldPath Path where the field data will be stored in the Formik data.
 * @param {String} label Field Label.
 * @param {String} labelIcon Field icon.
 * @param {Bool} required Flag to set if the field is required in the form.
 * @returns {JSX.Element}
 */
export const PlaceField = ({ fieldPath, label, labelIcon, required }) => (
  <TextField
    fieldPath={fieldPath}
    label={<FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />}
    required={required}
    className={'location-place-field'}
  />
);

PlaceField.propTypes = {
  fieldPath: PropTypes.string,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  required: PropTypes.bool,
};

PlaceField.defaultProps = {
  fieldPath: 'place',
  label: i18next.t('Place'),
  labelIcon: 'street view',
};
