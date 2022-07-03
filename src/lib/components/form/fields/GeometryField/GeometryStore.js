/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';

import { GeometryMutator } from '../../../../base';

/**
 * Geometry Store class used to create a standard way to access and manipulate
 * the geometry data in the Formik Store.
 */
export class GeometryStore {
  /**
   * @constructor
   * @param {Object} formikProps Formik Bag object.
   */
  constructor(formikProps = null) {
    this.formikProps = formikProps ? formikProps : null;
    this.fieldPath = formikProps ? formikProps.field.name : null;
  }

  /**
   * Load the formik object.
   *
   * @param {Object} formikProps Formik Bag object.
   */
  loadFormikProps(formikProps) {
    this.formikProps = formikProps;
    this.fieldPath = formikProps.field.name;
  }

  /**
   * Get geometries values.
   */
  getGeometries() {
    if (!this.isEmpty()) {
      // generating the geometry objects
      const geometryObjects =
        GeometryMutator.generateGeometryObjectsFromFeatures(
          GeometryMutator.generateGeoJSONFeature(this.formikProps.field.value)
        );

      return GeometryMutator.generateGeoJSONFeature(geometryObjects);
    }

    return {};
  }

  /**
   * Set geometries.
   */
  setGeometries(data) {
    if (this.isInitialized()) {
      let featureData = data;
      let geometryObjects = null;

      if (!GeometryMutator.isFeatureOrFeatureCollection(featureData)) {
        featureData = GeometryMutator.generateGeoJSONFeature(featureData);
      }

      geometryObjects =
        GeometryMutator.generateGeometryObjectsFromFeatures(featureData);

      this.formikProps.form.setFieldValue(this.fieldPath, geometryObjects);
    }
  }

  /**
   * Remove all geometries from the store.
   */
  clean() {
    if (this.isInitialized()) {
      this.formikProps.form.setFieldValue(this.fieldPath, {});
    }
  }

  /**
   * Check if the store is empty.
   */
  isEmpty() {
    return !this.isInitialized() || _isEmpty(this.formikProps.field.value);
  }

  /**
   * Check if the formik props is already initialized.
   */
  isInitialized() {
    return !_isNil(this.formikProps);
  }
}
