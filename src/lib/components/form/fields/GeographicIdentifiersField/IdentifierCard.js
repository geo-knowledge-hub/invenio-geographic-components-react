/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

import _capitalize from 'lodash/capitalize';
import _compact from 'lodash/compact';

import { Button, Label } from 'semantic-ui-react';

import { i18next } from '@translations/i18next';

import {
  IdentifierMetadataModal,
  describe,
  geometryOf,
  summarize,
} from '../../../geoidentifiers';

/**
 * One chosen identifier.
 *
 * The search box forgets a place the moment it is chosen, which is where the
 * doubt starts: was that the Springfield in Illinois or the one in Queensland?
 * So each choice keeps its own row, showing what it is, with everything that can
 * be done with it in one place.
 *
 * The row is laid out here rather than with `List`, whose own rules for how an
 * item divides its width leave the text in a column a few characters wide.
 * @constructor
 *
 * @param {Object} record Geographic Identifiers record.
 * @param {Function} onRemove Function called to drop the identifier from the selection.
 * @param {Function} onAddGeometry Function called with the record geometry to put it on
 *                                 the map. Omitted when there is no map to add it to.
 * @param {Function} isGeometryOnMap Function answering whether the record geometry is
 *                                   already on the map.
 * @returns {JSX.Element}
 */
export const IdentifierCard = ({
  record,
  onRemove,
  onAddGeometry,
  isGeometryOnMap,
}) => {
  const { name, scheme, population, coordinates } = summarize(record);

  const description = describe(record);
  const geometry = geometryOf(record);

  // Side-effect: check if the geometry is on the map
  const onMap = Boolean(
    geometry && isGeometryOnMap && isGeometryOnMap(geometry)
  );

  // Side-effect: compact the facts
  const facts = _compact([
    population && i18next.t('Population {{population}}', { population }),
    coordinates,
  ]).join(' · ');

  // Render the card
  return (
    <li className={'geographic-identifier-card'}>
      <div className={'geographic-identifier-card-body'}>
        <div className={'geographic-identifier-card-name'}>
          {name}
          {scheme && <Label size={'mini'}>{_capitalize(scheme)}</Label>}
        </div>

        {description && (
          <div className={'geographic-identifier-card-place'}>
            {description}
          </div>
        )}

        {facts && (
          <div className={'geographic-identifier-card-facts'}>{facts}</div>
        )}
      </div>

      <div className={'geographic-identifier-card-actions'}>
        <Button.Group basic size={'mini'}>
          <IdentifierMetadataModal
            record={record}
            trigger={
              <Button
                type={'button'}
                icon={'info circle'}
                content={i18next.t('Details')}
              />
            }
          />

          {geometry &&
            onAddGeometry &&
            (onMap ? (
              <Button
                type={'button'}
                disabled
                icon={'check'}
                content={i18next.t('On map')}
              />
            ) : (
              <Button
                type={'button'}
                icon={'map marker alternate'}
                content={i18next.t('Add to map')}
                onClick={() => onAddGeometry(geometry)}
              />
            ))}

          <Button
            type={'button'}
            icon={'trash alternate outline'}
            onClick={() => onRemove(record)}
            aria-label={i18next.t('Remove {{name}}', { name })}
          />
        </Button.Group>
      </div>
    </li>
  );
};

IdentifierCard.propTypes = {
  record: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
  onAddGeometry: PropTypes.func,
  isGeometryOnMap: PropTypes.func,
};
