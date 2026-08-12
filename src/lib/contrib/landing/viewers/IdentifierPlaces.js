/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Button, List } from 'semantic-ui-react';

import { i18next } from '@translations/i18next';

import {
  IdentifierMetadataModal,
  describe,
  summarize,
} from '../../../components/geoidentifiers';

/**
 * The places a record's locations point at.
 *
 * A record names its places by identifier, which is the right thing to store and
 * the wrong thing to read: `geonames::3448439` tells nobody that the record is
 * about São Paulo. Each one is listed here by name, next to the map it belongs
 * on. The name brings the place up on the map, and the whole record is a click
 * further on.
 * @constructor
 *
 * @param {Array.<Object>} identifiers Location identifiers, as the record stores them.
 * @param {Object} records Vocabulary records by identifier.
 * @param {Function} onSelect Function called with an identifier when its place is chosen.
 * @returns {JSX.Element|null}
 */
export const IdentifierPlaces = ({ identifiers, records, onSelect }) => {
  if (!identifiers.length) {
    return null;
  }

  return (
    <div className={'geographic-identifier-places'}>
      <List relaxed divided>
        {identifiers.map(({ scheme, identifier }) => {
          // A place the vocabulary no longer holds is still part of the record,
          // so it is listed as what the record stores rather than left out.
          const record = records[identifier] || {
            id: identifier,
            scheme,
            name: identifier,
          };

          const { name } = summarize(record);
          const description = describe(record);

          return (
            <List.Item key={identifier}>
              <List.Content floated={'right'}>
                <IdentifierMetadataModal
                  record={record}
                  trigger={
                    <Button
                      basic
                      compact
                      size={'mini'}
                      type={'button'}
                      icon={'info circle'}
                      aria-label={i18next.t('Details about {{name}}', { name })}
                    />
                  }
                />
              </List.Content>

              <List.Content
                as={'a'}
                role={'button'}
                tabIndex={0}
                onClick={() => onSelect(identifier)}
                onKeyDown={(event) =>
                  ['Enter', ' '].includes(event.key) && onSelect(identifier)
                }
                className={'geographic-identifier-place'}
              >
                <List.Header>{name}</List.Header>
                {description && (
                  <List.Description>{description}</List.Description>
                )}
              </List.Content>
            </List.Item>
          );
        })}
      </List>
    </div>
  );
};

IdentifierPlaces.propTypes = {
  identifiers: PropTypes.arrayOf(
    PropTypes.shape({
      scheme: PropTypes.string,
      identifier: PropTypes.string.isRequired,
    })
  ).isRequired,
  records: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
};

IdentifierPlaces.defaultProps = {
  records: {},
};
