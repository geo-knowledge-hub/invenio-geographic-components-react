/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Map event handler.
 */
export class MapEventHandler {
  /**
   * @constructor
   * @param {Object} geometryStore Geometry Store object.
   * @param {Function} renderFlagGenerator Function to generate a flag identifier
   *                                       for the current render step.
   */
  constructor(geometryStore, renderFlagGenerator) {
    this.geometryStore = geometryStore;
    this.uniqueLayer = geometryStore.uniqueLayer;

    this.renderFlagGenerator = renderFlagGenerator;
  }

  /**
   * Apply the rules to enable the support of unique layer in the map.
   * @private
   */
  _checkForUniqueLayer() {
    if (this.uniqueLayer) {
      this.geometryStore.getLayers().forEach((layer) => {
        this._removeLayerFromIndex(layer);
      });
    }
  }

  /**
   * Make a copy of the layer identifier (`_store_identifier`) from the `oldLayer`
   * to the `newLayer`.
   * @param {Object} oldLayer `Leaflet.Layer` from where the identifier will be copied.
   * @param {Object} newLayer `Leaflet.Layer` where the identifier will be set.
   * @private
   */
  _copyLayerIdentifier(oldLayer, newLayer) {
    newLayer._store_identifier = oldLayer._store_identifier;
  }

  /**
   * Add a new layer to the Index.
   *
   * @param {Object} layer Layer to be added in the index.
   * @private
   */
  _addLayerToIndex(layer) {
    this.geometryStore.addLayer(layer);

    this.renderFlagGenerator(this.geometryStore.indexKey);
  }

  /**
   * Update a layer reference in the Index.
   *
   * @param {Object} layer Layer to be updated. This layer must be a new reference
   *                       with the id of the layer to be replaced.
   * @private
   */
  _updateLayerOnIndex(layer) {
    this.geometryStore.updateLayer(layer);

    this.renderFlagGenerator(this.geometryStore.indexKey);
  }

  /**
   * Remove a layer from the Index.
   *
   * @param {Object} layer Layer to be removed.
   * @private
   */
  _removeLayerFromIndex(layer) {
    this.geometryStore.removeLayer(layer);

    this.renderFlagGenerator(this.geometryStore.indexKey);
  }

  /**
   * onCreate event handler.
   * @param {Object} e event object;
   */
  onCreate(e) {
    this._checkForUniqueLayer();
    this._addLayerToIndex(e.layer);
  }

  /**
   * onEdit event handler.
   * @param {Object} e event object;
   */
  onEdit(e) {
    const newLayer = e.layer;
    const oldLayer = e.sourceTarget;

    // updating the index
    this._copyLayerIdentifier(oldLayer, newLayer);

    this._checkForUniqueLayer();
    this._updateLayerOnIndex(newLayer);
  }

  /**
   * onRemove event handler.
   * @param {Object} e event object;
   */
  onRemove(e) {
    this._removeLayerFromIndex(e.sourceTarget);
  }

  /**
   * onCut event handler.
   * @param {Object} e event object;
   */
  onCut(e) {
    this._checkForUniqueLayer();
    this._updateLayerOnIndex(e.layer);
  }
}
