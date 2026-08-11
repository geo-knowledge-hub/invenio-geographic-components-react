/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { Marker, Polygon } from 'leaflet';

import { MapEventHandler } from './MapEventHandler';
import { GeometryStore } from '../GeometryStore';

/**
 * Get the formik props
 *
 * @returns {Object} The formik props
 */
const formikProps = () => {
  const props = {
    field: { name: 'geometry', value: {} },
    form: {
      setFieldValue: jest.fn((path, value) => {
        props.field.value = value;
      }),
    },
  };

  return props;
};

/**
 * Create a polygon
 *
 * @returns {Polygon} The polygon
 */
const polygon = () =>
  new Polygon([
    [46.1, 5.9],
    [46.1, 6.3],
    [46.4, 6.3],
  ]);

describe('MapEventHandler tests', () => {
  // Get the handler for a given store
  const handlerFor = (store) => new MapEventHandler(store, () => {});

  it('should keep a drawing the store accepts', () => {
    // Create the store
    const store = new GeometryStore(formikProps());
    // Create the layer
    const layer = new Marker([46.2, 6.14]);
    // Spy on the remove method
    const remove = jest.spyOn(layer, 'remove');

    // Create the handler
    handlerFor(store).onCreate({ layer });

    // Expect the remove method to not have been called
    expect(remove).not.toHaveBeenCalled();
  });

  it('should take a refused drawing off the map', () => {
    const store = new GeometryStore(formikProps());
    const handler = handlerFor(store);

    handler.onCreate({ layer: new Marker([46.2, 6.14]) });

    // A point and a polygon together are a GeometryCollection, which the
    // store refuses. The shape must not stay on the map looking saved.
    const refused = polygon();
    const remove = jest.spyOn(refused, 'remove');

    handler.onCreate({ layer: refused });

    expect(remove).toHaveBeenCalled();
  });
});
