/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Field } from 'formik';
import { FieldLabel } from 'react-invenio-forms';

import {
  Button,
  Breadcrumb,
  Divider,
  Grid,
  Header,
  Segment,
  Icon,
} from 'semantic-ui-react';

import { i18next } from '@translations/i18next';

import { GeometryStore } from './GeometryStore';
import { ImportManager } from '../../../import';
import { InteractiveMap } from './InteractiveMap';

/**
 * Geometry field component.
 * @constructor
 *
 * @param {String} fieldPath Path where the field data will be stored in the Formik data.
 * @param {String} label Field Label
 * @param {String} labelIcon Field icon
 * @param {Object} menuOptions Configuration object for the menu. This parameter can be used
 *                             to change the `icon` and the `text` of the menu options
 *                             (e.g., `Import Manager` and `Interactive Map`).
 * @param {Function} onLoadError Function called when the data load has error. This function can be used to present
 *                               a message (e.g., toast) to the user.
 * @param {Function} onDataClean Function called when the data is cleaned. This function can be used to present
 *                               a message (e.g., toast) to the user.
 * @param {Function} onDataLoad Function called when the data is loaded. This function can be used to present
 *                               a message (e.g., toast) to the user.
 * @param {Object} interactiveMapConfig Configuration object for the `Interactive Map` component.
 * @returns {JSX.Element}
 */
export const GeometryField = ({
  fieldPath,
  label,
  labelIcon,
  menuOptions,
  onLoadError,
  onDataClean,
  onDataLoad,
  interactiveMapConfig,
}) => {
  // States
  const [geometryStore, setGeometryStore] = useState(new GeometryStore());
  const [interactiveMapInitialized, setInteractiveMapInitialized] =
    useState(false);
  const [activatedBreadcrumb, setActivatedBreadcrumb] = useState('menu');

  // Handlers
  const changeBreadcrumb = (breadcrumbName) =>
    setActivatedBreadcrumb(breadcrumbName);

  const enableEmptyInteractiveMap = (formikProps) => () => {
    changeBreadcrumb('visualization');
    setInteractiveMapInitialized(true);
  };

  // Handlers - Callback proxies
  const onLoadErrorCallback = (formikProps) => (data) => {
    onLoadError(data);
  };

  const onDataLoadCallback = (formikProps) => {
    geometryStore.loadFormikProps(formikProps);

    return (data) => {
      geometryStore.setGeometries(data);

      // Side effecting
      onDataLoad(data);
      setInteractiveMapInitialized(true);
      setActivatedBreadcrumb('visualization');
    };
  };

  const onCleanDataCallback = (formikProps) => () => {
    // Cleaning the store
    geometryStore.clean();

    // Return the breadcrumb to the default.
    setActivatedBreadcrumb('menu');

    // Side effecting.
    onDataClean();
    setInteractiveMapInitialized(false);
  };

  return (
    <Field name={fieldPath}>
      {(formikProps) => (
        <>
          <div>
            <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          </div>
          <Segment>
            <Grid>
              <Grid.Column floated={'left'} width={5}>
                <Breadcrumb>
                  <Breadcrumb.Section
                    link={true}
                    active={activatedBreadcrumb === 'menu'}
                    onClick={() => {
                      if (!interactiveMapInitialized) {
                        changeBreadcrumb('menu');
                      }
                    }}
                  >
                    {i18next.t('Menu')}
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider />
                  <Breadcrumb.Section
                    link={true}
                    active={activatedBreadcrumb === 'visualization'}
                    onClick={() => {
                      if (interactiveMapInitialized) {
                        changeBreadcrumb('visualization');
                      }
                    }}
                  >
                    {i18next.t('Visualization')}
                  </Breadcrumb.Section>
                </Breadcrumb>
              </Grid.Column>

              <Grid.Column floated={'right'} width={5}>
                <Button
                  basic
                  icon={'repeat'}
                  floated={'right'}
                  size={'tiny'}
                  content={i18next.t('Reset')}
                  labelPosition={'left'}
                  disabled={!interactiveMapInitialized}
                  onClick={onCleanDataCallback(formikProps)}
                />
              </Grid.Column>
            </Grid>
            <Segment placeholder>
              {interactiveMapInitialized &&
              activatedBreadcrumb === 'visualization' ? (
                <>
                  <InteractiveMap
                    formikProps={formikProps}
                    {...interactiveMapConfig}
                  />
                </>
              ) : (
                <Grid columns={2} stackable textAlign="center">
                  <Divider vertical>Or</Divider>

                  <Grid.Row verticalAlign="middle">
                    <Grid.Column>
                      <Header as={'h3'} icon>
                        <Icon name={menuOptions.interactiveMap.icon} />
                        {menuOptions.interactiveMap.header}
                      </Header>
                      <Button
                        content={i18next.t('Use')}
                        onClick={enableEmptyInteractiveMap(formikProps)}
                      />
                    </Grid.Column>

                    <Grid.Column>
                      <Header as={'h3'} icon>
                        <Icon name={menuOptions.importManager.icon} />
                        {menuOptions.importManager.header}
                      </Header>

                      <ImportManager
                        onImport={onDataLoadCallback(formikProps)}
                        onError={onLoadErrorCallback(formikProps)}
                        geometryLoaderConfig={{
                          dropdownConfig: {
                            as: Button,
                            text: i18next.t('Use'),
                          },
                        }}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              )}
            </Segment>
          </Segment>
        </>
      )}
    </Field>
  );
};

GeometryField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  menuOptions: PropTypes.shape({
    interactiveMap: PropTypes.object,
    importManager: PropTypes.shape({
      header: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    }),
  }),
  onLoadError: PropTypes.func,
  onDataClean: PropTypes.func,
  onDataLoad: PropTypes.func,
  interactiveMapConfig: PropTypes.object,
};

GeometryField.defaultProps = {
  fieldName: 'geometry',
  label: i18next.t('Geometry'),
  labelIcon: 'location arrow',
  menuOptions: {
    interactiveMap: {
      header: i18next.t('Interactive Map'),
      icon: 'location arrow',
    },
    importManager: {
      header: i18next.t('Import data'),
      icon: 'upload',
    },
  },
  onLoadError: (data) => {},
  onDataLoad: (data) => {},
  onDataClean: () => {},
  interactiveMapConfig: {},
};