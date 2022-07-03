/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { leafletLayerToObject } from './utils';
import { GeometryMutator } from '../../../../../base';

/**
 * Map event handler.
 */
export class MapEventHandler {
  /**
   * @constructor
   * @param {GeometryStore} geometryStore Geometry Store object.
   */
  constructor(geometryStore) {
    this.layersIndex = {};
    this.geometryStore = geometryStore;
  }

  // store methods.
  refreshStore(shouldBeRefreshed) {
    if (shouldBeRefreshed) {
      this.geometryStore.setGeometries(
        GeometryMutator.generateGeoJSONGeometryObject(
          Object.values(this.layersIndex)
        )
      );
    }
  }

  // index methods.
  upsertLayerToIndex(layer, refresh = true) {
    const layerObject = leafletLayerToObject(layer);

    this.layersIndex[layerObject.id] = layerObject;
    this.refreshStore(refresh);
  }

  removeLayerFromIndex(layerId, refresh = true) {
    delete this.layersIndex[layerId];
    this.refreshStore(refresh);
  }

  // event handling methods.
  onCreate(e, refresh = true) {
    this.upsertLayerToIndex(e.layer);
    this.refreshStore(refresh);
  }

  onEdit(e, refresh = true) {
    this.upsertLayerToIndex(e.layer);
    this.refreshStore(refresh);
  }

  onRemove(e, refresh = true) {
    this.removeLayerFromIndex(e.layer._leaflet_id);
    this.refreshStore(refresh);
  }

  onCut(e, refresh = true) {
    const newLayer = e.layer;
    const originalLayer = e.originalLayer;

    this.upsertLayerToIndex(newLayer, true);
    this.removeLayerFromIndex(originalLayer._leaflet_id);
  }
}
