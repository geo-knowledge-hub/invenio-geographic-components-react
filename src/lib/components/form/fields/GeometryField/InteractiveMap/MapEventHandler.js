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
   */
  constructor(geometryStore) {
    this.geometryStore = geometryStore;
  }

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
  }

  /**
   * Remove a layer from the Index.
   *
   * @param {Object} layer Layer to be removed.
   * @private
   */
  _removeLayerFromIndex(layer) {
    this.geometryStore.removeLayer(layer);
  }

  /**
   * onCreate event handler.
   * @param {Object} e event object;
   */
  onCreate(e) {
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
    this._updateLayerOnIndex(e.layer);
  }
}
