/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';

import _compact from 'lodash/compact';
import _keyBy from 'lodash/keyBy';
import _omit from 'lodash/omit';

import { getIn, useFormikContext } from 'formik';
import { Form } from 'semantic-ui-react';

import { FieldLabel, GroupField, RemoteSelectField } from 'react-invenio-forms';

import { i18next } from '@translations/i18next';

import { IdentifierCard } from './IdentifierCard';
import { IdentifierSuggestion } from './IdentifierSuggestion';
import { summarize } from '../../../geoidentifiers';

import './GeographicIdentifiersField.css';

/**
 * Value of the scheme selector that searches every scheme.
 */
const ALL_SCHEMES = 'all';

/**
 * Keys the dropdown adds to an option, which the record
 * behind it has no usefor.
 */
const OPTION_KEYS = ['text', 'value', 'key', 'content'];

/**
 * Turn a vocabulary record into the reference an InvenioRDM location uses.
 *
 * A location identifier is `{ scheme, identifier }` and nothing else. The
 * record schema refuses every other key, so that is all the form is allowed to
 * hold. Everything the vocabulary knows about the place is kept beside the
 * form, where it can be shown without ever requesting the record.
 *
 * @param {Object} record Geographic Identifiers record.
 * @returns {Object} Stored identifier.
 */
const toStoredIdentifier = (record) => ({
  scheme: record.scheme,
  identifier: record.id,
});

/**
 * Read the vocabulary record behind a stored identifier.
 *
 * @param {Object} stored Stored identifier.
 * @param {String} suggestionAPIUrl API the vocabulary is served from.
 * @returns {Promise<Object>} The record, or an error object.
 */
const readIdentifier = async (stored, suggestionAPIUrl) => {
  const id = stored.identifier || stored.id;

  try {
    const response = await axios.get(
      `${suggestionAPIUrl}/${encodeURIComponent(id)}`
    );

    return response.data;
  } catch (error) {
    // The vocabulary may no longer hold the entry, or may be unreachable
    return {
      id: id,
      name: id,
      scheme: stored.scheme,
    };
  }
};

/**
 * Turn a record into what the dropdown needs, keeping the record intact.
 *
 * @param {Array.<Object>} records Geographic Identifiers records.
 * @returns {Array.<Object>} Dropdown options.
 */
const serializeIdentifiers = (records) =>
  records.map((record) => {
    const { name, country } = summarize(record);

    return {
      ...record,
      // Semantic UI matches on `text` and would write it into a selection
      // label, so it stays a plain string. `content` is what the row renders.
      text: _compact([name, country]).join(', '),
      value: record.id,
      key: record.id,
      content: <IdentifierSuggestion record={record} />,
    };
  });

/**
 * Field for choosing places from a Geographic Identifiers vocabulary.
 *
 * @constructor
 *
 * @param {String} fieldPath Path where the field data will be stored in the Formik data.
 * @param {Array.<Object>} limitOptions Vocabularies that can be used to search for
 *                                      Geographic identifiers.
 * @param {String} label Field Label.
 * @param {String} labelIcon Field icon.
 * @param {Boolean} multiple Flag to set if multiple values are supported.
 * @param {Boolean} required Flag to set if the field is required in the form.
 * @param {String} placeholder Field placeholder.
 * @param {String} noQueryMessage Text to be presented to users when the field is empty.
 * @param {String} suggestionAPIUrl API URL from where the Geographic identifiers will
 *                                  be extracted.
 * @param {Function} onAddGeometry Function called with a GeoJSON Geometry when the user
 *                                 asks for a place to be put on the map. Without it,
 *                                 the offer is not made.
 * @param {Function} isGeometryOnMap Function answering whether a geometry is already on
 *                                   the map, so a place that is there says so instead of
 *                                   offering to be added again.
 * @returns {JSX.Element}
 */
export const GeographicIdentifiersField = ({
  fieldPath,
  limitOptions,
  label,
  labelIcon,
  multiple,
  required,
  placeholder,
  noQueryMessage,
  suggestionAPIUrl,
  onAddGeometry,
  isGeometryOnMap,
}) => {
  const { values, setFieldValue } = useFormikContext();

  const [initialValuesLoaded, setInitialValuesLoaded] = useState(false);
  const [limitTo, setLimitTo] = useState(limitOptions[0].value);

  // The vocabulary records behind what the form holds, kept by identifier. This
  // is what the suggestions, the cards and the metadata modal read
  const [records, setRecords] = useState({});

  // Get identifiers
  const selected = getIn(values, fieldPath, []);

  // Get record for an identifier
  const recordFor = (stored) =>
    records[stored.identifier] || {
      id: stored.identifier,
      scheme: stored.scheme,
      name: stored.identifier,
    };

  // Save records
  const rememberRecords = (found) =>
    setRecords((known) => ({
      ...known,
      ..._keyBy(
        found.map((record) => _omit(record, OPTION_KEYS)),
        'id'
      ),
    }));

  // Load metadata of reference identifiers
  useEffect(() => {
    // Get values
    const stored = getIn(values, fieldPath, []);

    // If no identifiers, there is nothing to load
    if (stored.length === 0) {
      setInitialValuesLoaded(true);

      return undefined;
    }

    // Abort if the component is unmounted
    let abandoned = false;

    // Load metadata of identifiers
    Promise.all(
      // Read identifier
      stored.map((identifier) => {
        return readIdentifier(identifier, suggestionAPIUrl);
      })
    ).then((found) => {
      // Abort if the component is unmounted
      if (abandoned) {
        return;
      }

      rememberRecords(found);
      setInitialValuesLoaded(true);
    });

    return () => {
      abandoned = true;
    };
  }, []);

  /**
   * Scope the query to the chosen scheme, the way the vocabulary expects.
   */
  const prepareSuggest = (searchQuery) =>
    limitTo === ALL_SCHEMES ? searchQuery : `${limitTo}:${searchQuery}`;

  /**
   * Suggest the places that are not on the list already.
   */
  const suggestUnlisted = (records) =>
    serializeIdentifiers(
      records.filter(
        ({ id }) => !selected.some(({ identifier }) => identifier === id)
      )
    );

  /**
   * Add what was picked in the search box to the list.
   */
  const addIdentifiers = (picked) => {
    // Save records
    rememberRecords(picked);

    // Get added identifiers
    const added = picked
      .filter(({ id }) => !selected.some((stored) => stored.identifier === id))
      .map(toStoredIdentifier);

    // If there are added identifiers, add them to the form
    if (added.length) {
      setFieldValue(fieldPath, [...selected, ...added]);
    }
  };

  /**
   * Remove an identifier from the list.
   */
  const removeIdentifier = (record) => {
    // Remove identifier from the form
    setFieldValue(
      fieldPath,
      selected.filter(({ identifier }) => identifier !== record.id)
    );
  };

  return (
    <>
      <GroupField
        className={'main-group-field'}
        style={{ marginBottom: '1em' }}
      >
        <Form.Field width={5}>
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          <GroupField style={{ padding: 0 }}>
            <Form.Field
              width={8}
              style={{ marginBottom: 'auto', marginTop: 'auto' }}
            >
              {i18next.t('Suggest from')}
            </Form.Field>
            <Form.Dropdown
              defaultValue={limitOptions[0].value}
              fluid
              onChange={(event, data) => setLimitTo(data.value)}
              options={limitOptions}
              selection
              width={8}
            />
          </GroupField>
        </Form.Field>

        {initialValuesLoaded && (
          <RemoteSelectField
            // Picking a place moves it to the list, which leaves the box empty
            // and ready for the next one. Semantic UI has no way to be told
            // that, so the box is built again.
            key={selected.map(({ identifier }) => identifier).join('|')}
            allowAdditions={false}
            fieldPath={fieldPath}
            multiple={multiple}
            noQueryMessage={noQueryMessage}
            onValueChange={(_, picked) => addIdentifiers(picked)}
            placeholder={placeholder}
            preSearchChange={prepareSuggest}
            required={required}
            search={(options) => options}
            serializeSuggestions={suggestUnlisted}
            suggestionAPIUrl={suggestionAPIUrl}
            value={multiple ? [] : ''}
            label={<label className={'mobile-hidden'}>&nbsp;</label>}
            width={11}
          />
        )}
      </GroupField>

      {selected.length > 0 && (
        // List scrolls rather than growing
        <ul className={'geographic-identifier-cards'}>
          {selected.map((stored) => (
            <IdentifierCard
              key={stored.identifier}
              record={recordFor(stored)}
              onRemove={removeIdentifier}
              onAddGeometry={onAddGeometry}
              isGeometryOnMap={isGeometryOnMap}
            />
          ))}
        </ul>
      )}
    </>
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
  placeholder: PropTypes.string,
  noQueryMessage: PropTypes.string,
  suggestionAPIUrl: PropTypes.string.isRequired,
  onAddGeometry: PropTypes.func,
  isGeometryOnMap: PropTypes.func,
};

GeographicIdentifiersField.defaultProps = {
  fieldPath: 'identifiers',
  limitOptions: [
    {
      text: 'GeoNames',
      value: 'geonames', // Available on: Invenio Geographic Identifiers.
    },
    {
      text: 'All',
      value: ALL_SCHEMES,
    },
  ],
  label: i18next.t('Identifiers'),
  labelIcon: 'id badge',
  multiple: true,
  placeholder: i18next.t('Select a geographic identifier'),
  noQueryMessage: i18next.t('Search geographical identifiers...'),
  suggestionAPIUrl: '/api/geoidentifiers',
};
