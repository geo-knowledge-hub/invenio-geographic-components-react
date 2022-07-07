/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import _map from 'lodash/map';
import _get from 'lodash/get';
import _uniq from 'lodash/uniq';
import _capitalize from 'lodash/capitalize';

import { useDrag, useDrop } from 'react-dnd';
import { Button, Item, Label, List, Icon, Ref } from 'semantic-ui-react';

import { LocationsModal } from './LocationsModal';

import { i18next } from '@translations/i18next';

/**
 * Location Item component.
 * @constructor
 *
 * @param {Object} location Location object.
 * @returns {JSX.Element}
 */
const LocationItem = ({ location }) => {
  // Preparing the location data.

  // Basic
  const place = _get(location, 'place');
  const description = _get(location, 'description');

  // Geometry
  const geometryType = _get(location, 'geometry.type');

  // Identifiers
  const identifiers = _get(location, 'identifiers', []);
  const identifierSchemeNames = _uniq(
    _map(identifiers, (value) => {
      return _capitalize(value.scheme);
    })
  );

  return (
    <Item>
      <Item.Content>
        {identifierSchemeNames && (
          <Item.Extra className="labels-actions">
            {geometryType && (
              // <Icon color={'blue'} size={'tiny'} name={'compass'} circular />

              <Label size={'tiny'} color={'blue'}>
                {geometryType}
              </Label>
            )}

            {identifierSchemeNames.map((scheme, index) => (
              <Label key={index} size={'tiny'} color={'grey'}>
                {scheme}
              </Label>
            ))}
          </Item.Extra>
        )}
      </Item.Content>

      {place && <Item.Header as="h5">{place}</Item.Header>}

      {description && <Item.Description>{description}</Item.Description>}
    </Item>
  );
};

/**
 * Locations Field Item.
 * @constructor
 *
 * @param {Object} index Index of the field in the store.
 * @param {Object} referenceKey Reference of the item.
 * @param {Array} identifiersError Array of identifier errors.
 * @param {Function} replaceLocation Function to replace the item in the store.
 * @param {Function} removeLocation Function to remove the item from the store.
 * @param {Function} moveLocation Function to move the position of the item in the store.
 * @param {String} addLabel Label used in the button for creating a new location.
 * @param {String} editLabel Label used in the button for editing an existing location.
 * @param {Object} initialLocation Location values.
 *
 * @note This component is based on `CreatibutorsFieldItem` from React Invenio Deposit.
 * @see https://github.com/inveniosoftware/react-invenio-deposit/blob/0e7977fa917a21bf0ff9f69025e3aedd7a747000/src/lib/components/Creatibutors/CreatibutorsFieldItem.js
 */
export const LocationsFieldItem = ({
  index,
  referenceKey,
  identifiersError,
  replaceLocation,
  removeLocation,
  moveLocation,
  addLabel,
  editLabel,
  initialLocation,
}) => {
  // Definitions
  const firstError =
    identifiersError &&
    identifiersError.find((item) => ![undefined, null].includes(item));

  // Hooks
  const dropRef = useRef(null);

  const [_, drag, preview] = useDrag({
    item: { index, type: 'locations' },
  });

  const [{ hidden }, drop] = useDrop({
    accept: 'locations',
    hover(item, monitor) {
      const hoverIndex = index;
      const dragItemIndex = item.index;

      if (!dropRef.current) {
        return;
      }

      // Don't replace items with themselves
      if (dragItemIndex === hoverIndex) {
        return;
      }

      if (monitor.isOver({ shallow: true })) {
        moveLocation(dragItemIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
    collect: (monitor) => ({
      hidden: monitor.isOver({ shallow: true }),
    }),
  });

  // Initialize the reference explicitly
  drop(dropRef);

  return (
    <Ref innerRef={dropRef} key={referenceKey}>
      <List.Item
        key={referenceKey}
        className={
          hidden ? 'deposit-drag-listitem hidden' : 'deposit-drag-listitem'
        }
      >
        <List.Content floated={'right'}>
          <LocationsModal
            action={'edit'}
            addLabel={addLabel}
            editLabel={editLabel}
            initialLocation={initialLocation}
            trigger={
              <Button size={'mini'} type={'button'} primary>
                {i18next.t('Edit')}
              </Button>
            }
            onLocationChange={(selectedLocation) => {
              replaceLocation(index, selectedLocation);
            }}
          />
          <Button
            size={'mini'}
            type={'button'}
            onClick={() => removeLocation(index)}
          >
            {i18next.t('Remove')}
          </Button>
        </List.Content>
        <Ref innerRef={drag}>
          <List.Icon name="bars" className="drag-anchor" />
        </Ref>
        <Ref innerRef={preview}>
          <List.Content>
            <LocationItem key={index} location={initialLocation} />
          </List.Content>
        </Ref>
      </List.Item>
    </Ref>
  );
};

LocationsFieldItem.propTypes = {
  index: PropTypes.number.isRequired,
  referenceKey: PropTypes.string.isRequired,
  identifiersError: PropTypes.arrayOf(Object),
  replaceLocation: PropTypes.func.isRequired,
  removeLocation: PropTypes.func.isRequired,
  moveLocation: PropTypes.func.isRequired,
  addLabel: PropTypes.string,
  editLabel: PropTypes.string,
  initialLocation: PropTypes.object,
};

LocationsFieldItem.defaultProps = {
  addLabel: i18next.t('Add location'),
  editLabel: i18next.t('Edit location'),
  initialLocation: {},
};
