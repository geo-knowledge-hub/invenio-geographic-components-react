/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { getIn, FieldArray } from 'formik';
import { FieldLabel } from 'react-invenio-forms';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Button, Form, Label, List, Icon } from 'semantic-ui-react';

import { LocationsModal } from './LocationsModal';

import { i18next } from '@translations/i18next';
import { LocationsFieldItem } from './LocationsFieldItem';

/**
 * Description Formik field.
 * @constructor
 *
 * @param {Object} form Formik bag.
 * @param {Function} formikArrayRemove Formik function used to remove the location from the Formik store.
 * @param {Function} formikArrayRemove Formik function used to replace the location from the Formik store.
 * @param {Function} formikArrayRemove Formik function used to move the location from the Formik store.
 * @param {Function} formikArrayRemove Formik function used to push the location from the Formik store.
 * @param {String} fieldPath Path where the field data will be stored in the Formik data.
 * @param {Object} modalConfig Configuration object for the `LocationsModal` component. This object must define the following
 *                             properties:
 *                              - addLabel (string): Text for the button used to add a new location;
 *                              - editLabel (string): Text for the button used to edit an existing location.
 * @param locationAddButtonLabel
 * @param {String} label Field Label.
 * @param {String} labelIcon Field icon.
 * @param {Bool} required Flag to set if the field is required in the form.
 * @returns {JSX.Element}
 *
 * @note This component is based on `CreatibutorsField` from React Invenio Deposit.
 * @see https://github.com/inveniosoftware/react-invenio-deposit/blob/0e7977fa917a21bf0ff9f69025e3aedd7a747000/src/lib/components/Creatibutors/CreatibutorsField.js
 */
export const LocationsFieldForm = ({
  form: { values, errors, initialErrors, initialValues },
  remove: formikArrayRemove,
  replace: formikArrayReplace,
  move: formikArrayMove,
  push: formikArrayPush,
  name: fieldPath,
  modalConfig,
  locationAddButtonLabel,
  label,
  labelIcon,
  required,
}) => {
  // field values
  const formikValues = getIn(values, fieldPath, []);
  const formikInitialValues = getIn(initialValues, fieldPath, []);

  // field errors
  const error = getIn(errors, fieldPath, null);
  const initialError = getIn(initialErrors, fieldPath, null);
  const locationsError =
    error || (formikValues === formikInitialValues && initialError);

  return (
    <DndProvider backend={HTML5Backend}>
      <Form.Field
        required={required}
        className={(locationsError && 'error') || ''}
      >
        <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />

        <List>
          {getIn(values, fieldPath, []).map((value, index, array) => {
            // The `Locations` field must have the objects inside `features`
            // See: https://github.com/inveniosoftware/docs-invenio-rdm/blob/2dc8519a8ff36575b7c02ab8a4dab6603c2d715b/docs/reference/metadata.md#locations-0-n
            const key = `${fieldPath}.features.${index}`;

            // Base properties
            const geometry = `${key}.geometry`;
            const identifiers = `${key}.identifiers`;
            const place = `${key}.place`;
            const description = `${key}.description`;

            // Errors (ToDo)
            // const identifiersError = ...

            return (
              <>
                <LocationsFieldItem
                  key={key}
                  {...{
                    index,
                    referenceKey: key,
                    initialLocation: value,
                    removeLocation: formikArrayRemove,
                    replaceLocation: formikArrayReplace,
                    moveLocation: formikArrayMove,
                    addLabel: modalConfig.addLabel,
                    editLabel: modalConfig.editLabel,
                  }}
                  // identifiersError={identifiersError}
                />
              </>
            );
          })}
          <LocationsModal
            onLocationChange={(selectedLocation) => {
              formikArrayPush(selectedLocation);
            }}
            action={'add'}
            addLabel={modalConfig.addLabel}
            editLabel={modalConfig.editLabel}
            trigger={
              <Button type={'button'} labelPosition={'left'} icon>
                <Icon name={'add'} />
                {locationAddButtonLabel}
              </Button>
            }
          />
          {locationsError && typeof locationsError === 'string' && (
            <Label pointing={'left'} prompt>
              {locationsError}
            </Label>
          )}
        </List>
      </Form.Field>
    </DndProvider>
  );
};

/**
 * Locations Formik field.
 * @constructor
 *
 * @param {String} fieldPath Path where the field data will be stored in the Formik data.
 * @param {Object} locationsConfig Configuration object for the `LocationsFieldForm` component.
 * @returns {JSX.Element}
 */
export const LocationsField = ({ fieldPath, ...locationsConfig }) => (
  <>
    <FieldArray
      name={fieldPath}
      component={(formikProps) => (
        <LocationsFieldForm {...formikProps} {...locationsConfig} />
      )}
    />
  </>
);

LocationsField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  locationAddButtonLabel: PropTypes.string,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  required: PropTypes.bool,
  modalConfig: PropTypes.shape({
    addLabel: PropTypes.string.isRequired,
    editLabel: PropTypes.string.isRequired,
  }).isRequired,
};

LocationsField.defaultProps = {
  fieldPath: 'metadata.locations',
  locationAddButtonLabel: i18next.t('Add location'),
  label: i18next.t('Geographic Locations'),
  labelIcon: 'globe',
  modalConfig: {
    addLabel: i18next.t('Add location'),
    editLabel: i18next.t('Edit location'),
  },
};
