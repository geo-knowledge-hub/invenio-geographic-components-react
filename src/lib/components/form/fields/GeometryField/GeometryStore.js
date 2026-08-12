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

import {
  GeometryMutator,
  GeometryValidator,
  SUPPORTED_GEOMETRY_TYPES,
} from '../../../../base';
import { GeoJSON as LeafletGeoJSON } from 'leaflet';

/**
 * Why a change was refused.
 *
 * The reason travels with the refusal so that whoever presents it can say what
 * happened, rather than match on a sentence written somewhere else.
 */
export const GEOMETRY_REJECTIONS = {
  /** The geometry is already among the ones stored. */
  DUPLICATE: 'duplicate',
  /** The field holds one geometry, and it already has one. */
  UNIQUE_LAYER: 'unique-layer',
  /** Together with what is stored it would be a type the instance refuses. */
  UNSUPPORTED_TYPE: 'unsupported-type',
};

/**
 * Geometry Store class used to create a standard way to access and manipulate
 * the geometry data in the Formik Store.
 */
export class GeometryStore {
  /**
   * @constructor
   * @param {Object} formikProps Formik Bag object.
   * @param {Boolean} uniqueLayer Enable/Disable users to draw multiple geometries in the map.
   * @param {Object} options Store options:
   *                          - `geometryTypes` (Array): geometry types the instance
   *                            accepts. Drawings that would produce anything else are
   *                            refused, so the depositor is not left with a shape the
   *                            record cannot keep;
   *                          - `onRejected` (Function): called with `{ type, allowedTypes }`
   *                            when a change is refused, and with `null` once a
   *                            change is stored.
   */
  constructor(formikProps = null, uniqueLayer = false, options = {}) {
    // definitions
    this.formikProps = null;
    this.fieldPath = null;
    this.uniqueLayer = uniqueLayer;

    this.geometryTypes = options.geometryTypes || SUPPORTED_GEOMETRY_TYPES;
    this.onRejected = options.onRejected || (() => {});

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
        const previousIndex = { ...this.geometryIndex };

        operation(layerKey, layer);
        return this._commit(previousIndex);
      }
    }
    return false;
  }

  /**
   * Save the Store Index in the Formik storage, keeping the index and the
   * stored value in step.
   *
   * A set of layers is not stored as it is drawn: two shapes of the same type
   * become a `Multi...` geometry and two of different types a
   * `GeometryCollection`, and most of those are not geometries InvenioRDM can
   * keep. When the drawing would produce one of them the index is put back the
   * way it was, so the map, the store and the record never disagree.
   *
   * @param {Object} previousIndex Index to restore if the change is refused.
   * @returns {Boolean} Whether the change was stored.
   * @private
   */
  _commit(previousIndex) {
    if (this._updateFormikStore()) {
      return true;
    }

    this.geometryIndex = previousIndex;
    return false;
  }

  /**
   * Write a geometry to the Formik storage, unless the instance cannot keep it.
   *
   * @param {Object} geometryObject GeoJSON Geometry object.
   * @returns {Boolean} Whether the geometry was accepted and stored.
   * @private
   */
  _storeGeometry(geometryObject) {
    if (
      !GeometryValidator.isGeometryTypeAllowed(
        geometryObject,
        this.geometryTypes
      )
    ) {
      this.onRejected({
        reason: GEOMETRY_REJECTIONS.UNSUPPORTED_TYPE,
        type: geometryObject.type,
        allowedTypes: this.geometryTypes,
      });

      return false;
    }

    this.formikProps.form.setFieldValue(this.fieldPath, geometryObject);
    this.onRejected(null);
    return true;
  }

  /**
   * Save the Store Index in the Formik storage.
   *
   * @returns {Boolean} Whether the geometry was accepted and stored.
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

    return this._storeGeometry(
      GeometryMutator.generateGeometryObjectsFromFeatures(features)
    );
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
   * An imported file goes through the same check as a drawing: a file holding
   * features of more than one type also collapses into a `GeometryCollection`.
   *
   * @param {Object} geoJsonData GeoJSON Object.
   * @returns {Boolean} Whether the geometry was accepted and stored.
   */
  loadGeoJSON(geoJsonData) {
    return this._storeGeometry(
      GeometryMutator.generateGeometryObjectsFromFeatures(geoJsonData)
    );
  }

  /**
   * Add a geometry to the ones already stored.
   *
   * @param {Object} geometry GeoJSON Geometry object.
   * @returns {Boolean} Whether the geometry was accepted and stored.
   */
  addGeometry(geometry) {
    if (!this.isInitialized() || _isEmpty(geometry)) {
      return false;
    }

    if (
      GeometryValidator.containsGeometry(this.formikProps.field.value, geometry)
    ) {
      // Asked before the unique-layer check: both are true of a place added
      // twice to a field that holds one, and this is the more useful answer
      this.onRejected({ reason: GEOMETRY_REJECTIONS.DUPLICATE });
      return false;
    }

    // Check if the field holds one geometry and
    // it already has one
    if (!this.isEmpty() && this.uniqueLayer) {
      this.onRejected({ reason: GEOMETRY_REJECTIONS.UNIQUE_LAYER });

      return false;
    }

    // Merge the geometry with the existing ones
    let merged = geometry;

    if (!this.isEmpty()) {
      merged = GeometryMutator.generateGeometryObjectsFromFeatures({
        type: 'FeatureCollection',
        features: [
          ...GeometryMutator.generateGeometryExploded(
            this.formikProps.field.value
          ),
          GeometryMutator.generateGeoJSONFeature(geometry),
        ],
      });
    }

    if (!this._storeGeometry(merged)) {
      return false;
    }

    // Drop the index and read back from the Formik storage the next time
    // the layers are asked for
    this.geometryIndex = {};
    this.lastModificationKey = -1;

    return true;
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
   * @returns {Boolean} Whether the layer was stored.
   */
  addLayer(layer) {
    const previousIndex = { ...this.geometryIndex };
    const layerKey = this._generateKey();

    if (this.uniqueLayer) {
      this.geometryIndex = {};
    }

    layer._store_identifier = layerKey;
    this.geometryIndex[layerKey] = layer;

    return this._commit(previousIndex);
  }

  /**
   * Update a `Leaflet.Layer` from the Store.
   * @param {Object} layer Leaflet Layer to be updated in the store.
   * @returns {Boolean} Whether the change was stored.
   */
  updateLayer(layer) {
    return this._operateOnPreDefinedLayer(layer, (layerKey, layer) => {
      this.geometryIndex[layerKey] = layer;
    });
  }

  /**
   * Remove a `Leaflet.Layer` from the Store.
   * @param {Object} layer Leaflet Layer to be removed from the store.
   * @returns {Boolean} Whether the change was stored.
   */
  removeLayer(layer) {
    return this._operateOnPreDefinedLayer(layer, (layerKey, layer) => {
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
