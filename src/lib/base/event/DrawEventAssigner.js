/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { isPropertyDefined } from '../utils';
import {
  DrawEventMethods,
  MapDrawEvents,
  LayerDrawEvents,
} from './DrawEventTypes';

/**
 * Assign an event on Leaflet.Layer or Leaflet.Map.
 *
 * @param leafletElement Leaflet.Map or Leaflet.Layer object.
 * @param eventProvider Object with the definition of the events
 * @param eventName The event name used from the event provider.
 * @param eventType The event type name.
 */
const assignEvent = (leafletElement, eventProvider, eventName, eventType) => {
  if (isPropertyDefined(eventProvider, eventType)) {
    leafletElement.on(eventName, eventProvider[eventType].bind(eventProvider));
  }
};

/**
 * Assign Geoman Layer Event to a Leaflet.Layer object. This method expect that the `eventCallbackProvider` will
 * provide the following events:
 *
 *  - onEdit (optional)
 *  - onRemove (optional)
 *  - onCut (optional)
 *
 * @param layer Layer object
 * @param eventCallbackProvider Object with the Layer Event to be assigned in the layer.
 *
 * @see https://github.com/geoman-io/leaflet-geoman#edit-mode
 * @see https://github.com/geoman-io/leaflet-geoman#drag-mode
 * @see https://github.com/geoman-io/leaflet-geoman#removal-mode
 */
const assignLayerDrawEvents = (layer, eventCallbackProvider) => {
  Object.keys(LayerDrawEvents).forEach((eventType) => {
    const eventName = LayerDrawEvents[eventType];

    assignEvent(layer, eventCallbackProvider, eventName, eventType);
  });
};

/**
 * Assign Geoman Map Event to a Leaflet.Map object. This method expect that the `eventCallbackProvider` will
 * provide the following events:
 *
 *  - onCreate (optional)
 *  - onCut (optional)
 *  - onEdit (optional)
 *  - onRemove (optional)
 *  - onCut (optional)
 *
 * @param mapContext Map object
 * @param eventCallbackProvider Object with the Layer Event to be assigned in the layer.
 *
 * @see https://github.com/geoman-io/leaflet-geoman#edit-mode
 * @see https://github.com/geoman-io/leaflet-geoman#drag-mode
 * @see https://github.com/geoman-io/leaflet-geoman#removal-mode
 * @see https://github.com/geoman-io/leaflet-geoman#cut-mode
 */
const assignMapDrawEvents = (mapContext, eventCallbackProvider) => {
  // Defining the map level events (e.g., `onCreate` and `onCut`).

  /**
   * Assigning create event.
   */
  mapContext.on(MapDrawEvents.onCreate, ({ layer, shape }) => {
    // In the `onCreate` event, we first configure the draw events in the layer:
    //  - onEdit
    //  - onDeleted
    // Then, we call the `onCreate` method (if exists).

    // assigning the events in the generated layers.
    Object.keys(LayerDrawEvents).forEach((eventType) => {
      const eventName = LayerDrawEvents[eventType];
      assignEvent(layer, eventCallbackProvider, eventName, eventType);
    });

    // invoking `onCreated` event if defined.
    if (isPropertyDefined(eventCallbackProvider, DrawEventMethods.create)) {
      eventCallbackProvider[DrawEventMethods.create].bind(
        eventCallbackProvider
      )({ layer, shape });
    }
  });

  /**
   * Assigning cut event
   */
  assignEvent(
    mapContext,
    eventCallbackProvider,
    MapDrawEvents.onCut,
    DrawEventMethods.cut
  );

  /**
   * Assigning `Leaflet.Map.layeradd` event
   * (for when the layers are reloaded from the formik in the map).
   */
  mapContext.on('layeradd', ({ layer }) => {
    if (layer._map) {
      assignLayerDrawEvents(layer, eventCallbackProvider);
    }
  });
};

export const DrawEventAssigner = {
  assignLayerDrawEvents,
  assignMapDrawEvents,
};
