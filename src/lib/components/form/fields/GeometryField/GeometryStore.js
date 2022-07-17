/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';

import _has from 'lodash/has';

import { GeometryMutator } from '../../../../base';
import { GeoJSON as LeafletGeoJSON } from 'leaflet';

/**
 * Geometry Store class used to create a standard way to access and manipulate
 * the geometry data in the Formik Store.
 */
export class GeometryStore {
  /**
   * @constructor
   * @param {Object} formikProps Formik Bag object.
   * @param {Boolean} uniqueLayer Enable/Disable users to draw multiple geometries in the map.
   */
  constructor(formikProps = null, uniqueLayer = false) {
    // definitions
    this.formikProps = null;
    this.fieldPath = null;
    this.uniqueLayer = uniqueLayer;

    this.indexKey = 0;
    this.geometryIndex = {};

    // modification control
    this.lastModificationKey = -1;

    // initializing the values using the formik store
    this.loadFormikProps(formikProps);
  }

  /**
   * Generate a new key for a Layer.
   * @returns {number} Generated key
   * @private
   */
  _generateKey() {
    this.indexKey += 1;
    return this.indexKey;
  }

  /**
   * Load all layers from the Store index.
   * @private
   */
  _layersFromIndex() {
    return Object.values(this.geometryIndex);
  }

  /**
   * Perform an operation in a `pre-defined` layer (already defined in the Store Index).
   *
   * @param {Object} layer Layer used to perform the operation.
   * @param {Object} operation Operation function to be applied in the layer. This
   *                            function receives two parameters:
   *                              - `layerKey`: ID of the Layer in the Store;
   *                              - `layer`: Layer object.
   * @private
   */
  _operateOnPreDefinedLayer(layer, operation) {
    if (_has(layer, '_store_identifier')) {
      // update only pre-defined layers
      const layerKey = layer._store_identifier;

      if (!_isNil(layerKey)) {
        operation(layerKey, layer);
        this._updateFormikStore();
      }
    }
  }

  /**
   * Save the Store Index in the Formik storage.
   * @private
   */
  _updateFormikStore() {
    const layers = this._layersFromIndex();

    const features = layers.map((layer) => {
      const geojson = layer.toGeoJSON();

      if (geojson.type === 'FeatureCollection') {
        return geojson.features[0];
      }

      return geojson;
    });

    const geometryObject =
      GeometryMutator.generateGeometryObjectsFromFeatures(features);

    this.formikProps.form.setFieldValue(this.fieldPath, geometryObject);
  }

  /**
   * Load all layers from the Formik Storage and index them in the Store Index.
   *
   * @returns {*[]}
   * @private
   */
  _loadLayers() {
    let layers = [];

    if (!this.isEmpty()) {
      // Checking for the last modification.
      if (this.lastModificationKey !== this.indexKey) {
        const geometries = GeometryMutator.generateGeometryExploded(
          this.formikProps.field.value
        );

        const layers = geometries.map((geometry) => {
          // defining the layer and its key.
          const layer = new LeafletGeoJSON(geometry);
          const layerKey = this._generateKey();

          layer._store_identifier = layerKey;

          // storing in the index.
          this.geometryIndex[layerKey] = layer;
        });

        this.lastModificationKey = this.indexKey;
      }

      layers = this._layersFromIndex();
    }
    return layers;
  }

  /**
   * Load data from a Formik Object.
   *
   * @param {Object} formikProps Formik Bag object.
   */
  loadFormikProps(formikProps) {
    this.formikProps = formikProps ? formikProps : null;
    this.fieldPath = formikProps ? formikProps.field.name : null;
  }

  /**
   * Load data from a GeoJSON object.
   *
   * @param {Object} geoJsonData GeoJSON Object.
   */
  loadGeoJSON(geoJsonData) {
    const geometryObject =
      GeometryMutator.generateGeometryObjectsFromFeatures(geoJsonData);

    this.formikProps.form.setFieldValue(this.fieldPath, geometryObject);
  }

  /**
   * Get the layers stores in the Store.
   */
  getLayers() {
    return this._loadLayers();
  }

  /**
   * Add a `Leaflet.Layer` to the Store.
   * @param {Object} layer Leaflet Layer to be added to the store.
   */
  addLayer(layer) {
    const layerKey = this._generateKey();

    if (this.uniqueLayer) {
      this.geometryIndex = {};
    }

    layer._store_identifier = layerKey;
    this.geometryIndex[layerKey] = layer;

    this._updateFormikStore();
  }

  /**
   * Update a `Leaflet.Layer` from the Store.
   * @param {Object} layer Leaflet Layer to be updated in the store.
   */
  updateLayer(layer) {
    this._operateOnPreDefinedLayer(layer, (layerKey, layer) => {
      this.geometryIndex[layerKey] = layer;
    });
  }

  /**
   * Remove a `Leaflet.Layer` from the Store.
   * @param {Object} layer Leaflet Layer to be removed from the store.
   */
  removeLayer(layer) {
    this._operateOnPreDefinedLayer(layer, (layerKey, layer) => {
      delete this.geometryIndex[layerKey];
    });
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
