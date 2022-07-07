/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import _split from 'lodash/split';
import _capitalize from 'lodash/capitalize';

import { Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

import { FieldLabel, GroupField, RemoteSelectField } from 'react-invenio-forms';

import { i18next } from '@translations/i18next';

/**
 * Description field for Formik. This component allows users to select
 * a Geographic identifiers item from a specialized API.
 * @constructor
 *
 * @param {String} fieldPath Path where the field data will be stored in the Formik data.
 * @param {String} limitOptions Vocabularies that can be used to search for Geographic identifiers.
 * @param {String} label Field Label.
 * @param {String} labelIcon Field icon.
 * @param {Boolean} clearable  Flag to set if the user can clear the selected options.
 * @param {Boolean} multiple Flag to set if multiple values are supported.
 * @param {Boolean} required Flag to set if the field is required in the form.
 * @param {String} placeholder Field placeholder
 * @param {String} noQueryMessage Text to be presented to users when the field is empty.
 * @param {String} suggestionAPIUrl API URL from where the Geographic identifiers will be extracted.
 * @returns {JSX.Element}
 */
export const GeographicIdentifiersField = ({
  fieldPath,
  limitOptions,
  label,
  labelIcon,
  clearable,
  multiple,
  required,
  placeholder,
  noQueryMessage,
  suggestionAPIUrl,
}) => {
  const [fieldState, setFieldState] = useState({
    limitTo: limitOptions[0].value,
  });

  const prepareSuggest = (searchQuery) => {
    const limitTo = fieldState.limitTo;
    const prefix = limitTo === 'all' ? '' : `${limitTo}:`;

    return `${prefix}${searchQuery}`;
  };

  const serializeIdentifiers = (identifiers) =>
    identifiers.map((identifier) => {
      const scheme = _split(identifier.id, '::', 1).at(0); // pattern from geoidentifiers
      const schemeText = scheme ? `(${_capitalize(scheme)})` : '';

      return {
        text: `${schemeText} ${identifier.name}`,
        value: identifier.name,
        key: identifier.name,
        ...(identifier.id ? { id: identifier.id } : {}),
        name: identifier.name,
        scheme: scheme,
      };
    });

  return (
    <GroupField className={'main-group-field'}>
      <Form.Field width={5}>
        <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        <GroupField>
          <Form.Field
            width={8}
            style={{ marginBottom: 'auto', marginTop: 'auto' }}
            className={'p-0'}
          >
            {i18next.t('Suggest from')}
          </Form.Field>
          <Form.Dropdown
            className={'p-0'}
            defaultValue={limitOptions[0].value}
            fluid
            onChange={(event, data) => {
              setFieldState({ limitTo: data.value });
            }}
            options={limitOptions}
            selection
            width={8}
          />
        </GroupField>
      </Form.Field>
      <Field name={fieldPath}>
        {({ form: { values } }) => {
          return (
            <RemoteSelectField
              clearable={clearable}
              fieldPath={fieldPath}
              initialSuggestions={getIn(values, fieldPath, [])}
              multiple={multiple}
              noQueryMessage={noQueryMessage}
              placeholder={placeholder}
              preSearchChange={prepareSuggest}
              required={required}
              serializeSuggestions={serializeIdentifiers}
              suggestionAPIUrl={suggestionAPIUrl}
              onValueChange={({ formikProps }, selectedSuggestions) => {
                formikProps.form.setFieldValue(fieldPath, selectedSuggestions);
              }}
              value={getIn(values, fieldPath, []).map((val) => val.name)}
              label={
                <label className="mobile-hidden">&nbsp;</label>
              } /** For alignment purposes */
              allowAdditions={false}
              width={11}
            />
          );
        }}
      </Field>
    </GroupField>
  );
};

GeographicIdentifiersField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  limitOptions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  clearable: PropTypes.bool,
  placeholder: PropTypes.string,
  noQueryMessage: PropTypes.string,
  initialOptions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
      text: PropTypes.string,
    })
  ),
  suggestionAPIUrl: PropTypes.string.isRequired,
};

GeographicIdentifiersField.defaultProps = {
  fieldPath: 'identifiers',
  limitOptions: [
    {
      text: 'Geonames',
      value: 'GEONAMES', // Available on: Invenio Geographic Identifiers.
    },
    {
      text: 'All',
      value: 'all',
    },
  ],
  label: i18next.t('Identifiers'),
  labelIcon: 'id badge',
  multiple: true,
  clearable: true,
  placeholder: i18next.t('Select a geographic identifier'),
  noQueryMessage: i18next.t('Search geographical identifiers...'),
  suggestionAPIUrl: '/api/geoidentifiers',
};
