/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import _get from 'lodash/get';
import { Formik } from 'formik';

import { ActionButton } from 'react-invenio-forms';
import { Modal, Grid, Form, Header } from 'semantic-ui-react';

import { i18next } from '@translations/i18next';

import {
  PlaceField,
  DescriptionField,
  GeographicIdentifiersField,
  GeometryField,
} from '../internal';

/**
 * Locations modal.
 * @constructor
 *
 * @param {String} action Name of the action performed with the component (e.g., add or edit).
 * @param {Function} onLocationChange Function called when the location object changed.
 * @param {React.ReactNode} trigger Component used to trigger the Location Field Modal.
 * @param {String} addLabel Text used in the label when the component is used to add a new location.
 * @param {String} editLabel Text used in the label when the component is used to edit a location.
 * @param {Object} initialLocation Initial values for the location. This option can be used to fill the fields
 *                                 in the edition mode.
 * @param {Object} interactiveMapConfig Configuration object for the `InteractiveMap`.
 * @returns {JSX.Element}
 *
 * @note This component is based on `CreatibutorsModal` from React Invenio Deposit.
 * @see https://github.com/inveniosoftware/react-invenio-deposit/blob/0e7977fa917a21bf0ff9f69025e3aedd7a747000/src/lib/components/Creatibutors/CreatibutorsModal.js
 *
 */
export const LocationsModal = ({
  action,
  onLocationChange,
  trigger,
  addLabel,
  editLabel,
  initialLocation,
  interactiveMapConfig,
}) => {
  const [modalState, setModalState] = useState({
    open: false,
    action: null,
    formState: null,
  });

  /**
   * Messages
   */
  const Messages = {
    Added: i18next.t('Added'),
    SaveAndAdd: i18next.t('Save and add another'),
  };

  /**
   * Modal Actions
   */
  const modalActions = {
    ADD: 'add',
    EDIT: 'edit',
  };

  const openModal = () =>
    setModalState({ open: true, action: null, formState: null });
  const closeModal = () =>
    setModalState({ open: false, action: null, formState: null });

  /**
   * Addition Message
   */
  const [addedMessageState, setAddedMessageState] = useState(
    Messages.SaveAndAdd
  );

  /**
   * Change content effect (on addition)
   */
  const changeContent = () => {
    setAddedMessageState(Messages.Added);

    setTimeout(() => {
      setAddedMessageState(i18next.t(Messages.SaveAndAdd));
    }, 2000);
  };

  /**
   * Auxiliary functions
   */
  const deserializeLocation = (initialLocation) => ({
    place: _get(initialLocation, 'place', ''),
    description: _get(initialLocation, 'description', ''),
    geometry: _get(initialLocation, 'geometry', {}),
    identifiers: _get(initialLocation, 'identifiers', []),
  });

  /**
   * handleSubmit side effect.
   */
  useEffect(() => {
    modalState.formState ? modalState.formState.handleSubmit() : null;
  }, [modalState]);

  return (
    <Formik
      initialValues={deserializeLocation(initialLocation)}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, formikHelpers) => {
        onLocationChange(values);

        formikHelpers.setSubmitting(false);
        formikHelpers.resetForm();

        switch (modalState.action) {
          case 'saveAndContinue':
            closeModal();
            openModal();
            changeContent();
            break;

          case 'saveAndClose':
            closeModal();
            break;

          default:
            break;
        }
      }}
    >
      {({ values, resetForm }) => {
        const placePath = 'place';
        const geometryPath = 'geometry';
        const descriptionPath = 'description';

        const identifiersPath = 'identifiers';

        return (
          <Modal
            centered={false}
            onOpen={openModal}
            open={modalState.open}
            trigger={trigger}
            onClose={() => {
              closeModal();
              resetForm();
            }}
            closeIcon={true}
            closeOnDimmerClick={false}
          >
            <Modal.Header as={'h6'} className={'pt-10 pb-10'}>
              <Grid>
                <Grid.Column floated={'left'} width={4}>
                  <Header as={'h2'}>
                    {action === modalActions.ADD ? addLabel : editLabel}
                  </Header>
                </Grid.Column>
              </Grid>
            </Modal.Header>
            <Modal.Content>
              <Form>
                <PlaceField fieldPath={placePath} required={false} />
                <DescriptionField
                  fieldPath={descriptionPath}
                  required={false}
                />
                <GeographicIdentifiersField
                  fieldPath={identifiersPath}
                  multiple={true}
                  clearable={true}
                  required={false}
                />
                <GeometryField fieldPath={geometryPath} />
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <ActionButton
                name={'cancel'}
                onClick={(values, formikHelpers) => {
                  formikHelpers.resetForm();
                  closeModal();
                }}
                icon={'remove'}
                content={i18next.t('Cancel')}
                floated={'left'}
              />
              {action === modalActions.ADD && (
                <ActionButton
                  name={'submit'}
                  onClick={(event, form) => {
                    setModalState({
                      action: 'saveAndContinue',
                      formState: form,
                    });
                  }}
                  primary
                  icon={'checkmark'}
                  content={addedMessageState}
                />
              )}
              <ActionButton
                name={'submit'}
                onClick={(event, form) => {
                  setModalState({
                    action: 'saveAndClose',
                    formState: form,
                  });
                }}
                primary
                icon={'checkmark'}
                content={i18next.t('Save')}
              />
            </Modal.Actions>
          </Modal>
        );
      }}
    </Formik>
  );
};

LocationsModal.propTypes = {
  action: PropTypes.oneOf(['add', 'edit']).isRequired,
  onLocationChange: PropTypes.func,
  trigger: PropTypes.node.isRequired,
  addLabel: PropTypes.string.isRequired,
  editLabel: PropTypes.string.isRequired,
  initialLocation: PropTypes.shape({
    place: PropTypes.string,
    description: PropTypes.string,
    geometry: PropTypes.object,
    identifiers: PropTypes.array,
  }),
  interactiveMapConfig: PropTypes.object,
};

LocationsModal.defaultProps = {
  addLabel: i18next.t('Add location'),
  editLabel: i18next.t('Edit location'),
};
