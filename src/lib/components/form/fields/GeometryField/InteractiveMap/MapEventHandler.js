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
   * @returns {Boolean} Whether the store accepted the layer.
   *
   * @private
   */
  _addLayerToIndex(layer) {
    const stored = this.geometryStore.addLayer(layer);

    this.renderFlagGenerator(this.geometryStore.indexKey);

    return stored;
  }

  /**
   * Update a layer reference in the Index.
   *
   * @param {Object} layer Layer to be updated. This layer must be a new reference
   *                       with the id of the layer to be replaced.
   * @returns {Boolean} Whether the store accepted the change.
   *
   * @private
   */
  _updateLayerOnIndex(layer) {
    const stored = this.geometryStore.updateLayer(layer);

    this.renderFlagGenerator(this.geometryStore.indexKey);
    return stored;
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

    if (!this._addLayerToIndex(e.layer)) {
      // The store refused the geometry this drawing would have produced, so
      // the shape comes off the map too. Left there it would look saved while
      // the record has no trace of it
      e.layer.remove();
    }
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

    // An edit reshapes a layer without changing what kind of shape it is, so
    // the set of types is the same one the store already accepted. Nothing to
    // put back on refusal.
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
    const map = e.layer._map;

    this._checkForUniqueLayer();

    if (!this._updateLayerOnIndex(e.layer)) {
      // Cutting a polygon in two makes a MultiPolygon, which most instances
      // cannot store. Geoman has already swapped the shapes on the map, so the
      // uncut one goes back. `pm:cut` hands it over for exactly this
      e.layer.remove();

      if (map && e.originalLayer) {
        e.originalLayer.addTo(map);
      }
    }
  }
}
