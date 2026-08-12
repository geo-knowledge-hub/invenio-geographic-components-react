/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import _get from 'lodash/get';
import { Formik, getIn } from 'formik';

import { Button, Modal, Grid, Form, Header } from 'semantic-ui-react';

import { i18next } from '@translations/i18next';

import { GeometryValidator } from '../../../../base';

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
 * @param {Boolean} uniqueLayer Enable/Disable users to draw multiple geometries in the map.
 * @param {Array.<String>} geometryTypes Geometry types the instance accepts.
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
  uniqueLayer,
  geometryTypes,
}) => {
  const [modalState, setModalState] = useState({
    open: false,
    action: null,
    formState: null,
  });

  // A place chosen in the identifiers field already knows where it is, so the
  // geometry field is given a way to be handed that geometry instead of the
  // depositor having to find the same spot again by hand
  const geometryRef = useRef(null);

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
      {({ values, resetForm, ...form }) => {
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
                <Grid.Column floated={'left'} width={16}>
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
                  required={false}
                  onAddGeometry={(geometry) =>
                    geometryRef.current.addGeometry(geometry)
                  }
                  // Both fields are under this one form, so the geometry is
                  // right here to be read: a place already on the map says so
                  // on its own row, rather than being refused after the click.
                  isGeometryOnMap={(geometry) =>
                    GeometryValidator.containsGeometry(
                      getIn(values, geometryPath, {}),
                      geometry
                    )
                  }
                />
                <GeometryField
                  ref={geometryRef}
                  fieldPath={geometryPath}
                  interactiveMapConfig={interactiveMapConfig}
                  uniqueLayer={uniqueLayer}
                  geometryTypes={geometryTypes}
                />
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button
                name={'cancel'}
                onClick={() => {
                  resetForm();
                  closeModal();
                }}
                icon={'remove'}
                content={i18next.t('Cancel')}
                floated={'left'}
              />
              {action === modalActions.ADD && (
                <Button
                  name={'submit'}
                  onClick={() => {
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
              <Button
                name={'submit'}
                onClick={() => {
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
  uniqueLayer: PropTypes.bool,
  geometryTypes: PropTypes.arrayOf(PropTypes.string),
};

LocationsModal.defaultProps = {
  addLabel: i18next.t('Add location'),
  editLabel: i18next.t('Edit location'),
};
