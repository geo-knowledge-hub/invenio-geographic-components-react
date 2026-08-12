/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Header, Label, Modal, Table } from 'semantic-ui-react';

import { i18next } from '@translations/i18next';

import { alternateNamesOf, describe, detailsOf } from './metadata';

/**
 * How many alternate names are shown before the rest are folded away.
 */
const ALTERNATE_NAMES_SHOWN = 12;

/**
 * The names a place is also known by.
 *
 * @constructor
 *
 * @param {Array.<String>} names Alternate names.
 * @returns {JSX.Element}
 */
const AlternateNames = ({ names }) => {
  // State - Whether the alternate names are expanded
  const [expanded, setExpanded] = useState(false);

  // Calculate the number of hidden alternate names
  const hidden = names.length - ALTERNATE_NAMES_SHOWN;

  // Render!
  return (
    <>
      <Header as={'h5'}>{i18next.t('Also known as')}</Header>

      <Label.Group size={'small'}>
        {(expanded ? names : names.slice(0, ALTERNATE_NAMES_SHOWN)).map(
          (name) => (
            <Label key={name}>{name}</Label>
          )
        )}
      </Label.Group>

      {hidden > 0 && (
        <Button
          basic
          size={'tiny'}
          type={'button'}
          onClick={() => setExpanded(!expanded)}
          content={
            expanded
              ? i18next.t('Show fewer')
              : i18next.t('Show {{count}} more', { count: hidden })
          }
        />
      )}
    </>
  );
};

AlternateNames.propTypes = {
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
};

/**
 * Everything the vocabulary knows about a place.
 *
 * The record is shown as it was suggested, so opening this costs no request: a
 * suggestion already carries the whole thing, and the identifiers the form
 * starts with are read from the API in full.
 *
 * @constructor
 *
 * @param {Object} record Geographic Identifiers record.
 * @param {React.ReactNode} trigger Component used to open the modal.
 * @returns {JSX.Element}
 */
export const IdentifierMetadataModal = ({ record, trigger }) => {
  // State - Whether the modal is open
  const [open, setOpen] = useState(false);

  // Get the details and alternate names
  const details = detailsOf(record);
  const alternateNames = alternateNamesOf(record);

  // Render!
  return (
    <Modal
      centered={false}
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size={'small'}
      trigger={trigger}
    >
      <Modal.Header>
        <Header as={'h3'} content={record.name} subheader={describe(record)} />
      </Modal.Header>

      <Modal.Content>
        <Table basic={'very'} compact definition>
          <Table.Body>
            {details.map(({ label, value }) => (
              <Table.Row key={label}>
                <Table.Cell width={5}>{label}</Table.Cell>
                <Table.Cell>{value}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {alternateNames.length > 0 && <AlternateNames names={alternateNames} />}
      </Modal.Content>

      <Modal.Actions>
        <Button
          type={'button'}
          onClick={() => setOpen(false)}
          content={i18next.t('Close')}
        />
      </Modal.Actions>
    </Modal>
  );
};

IdentifierMetadataModal.propTypes = {
  record: PropTypes.object.isRequired,
  trigger: PropTypes.node.isRequired,
};
