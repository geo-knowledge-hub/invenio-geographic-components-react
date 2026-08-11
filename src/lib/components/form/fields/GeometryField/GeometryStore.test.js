/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { Marker, Polygon } from 'leaflet';

import { GeometryStore } from './GeometryStore';

/**
 * A Formik bag that records what the store writes.
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
 * Create a marker
 * @returns {Marker} The marker
 */
const marker = () => new Marker([46.2, 6.14]);
const polygon = () =>
  new Polygon([
    [46.1, 5.9],
    [46.1, 6.3],
    [46.4, 6.3],
  ]);

describe('GeometryStore tests', () => {
  describe('Accepted geometries', () => {
    it('should store a single geometry', () => {
      const props = formikProps();
      const store = new GeometryStore(props);

      expect(store.addLayer(marker())).toBe(true);
      expect(props.field.value.type).toBe('Point');
    });

    it('should store two geometries of the same type as a multi', () => {
      const props = formikProps();
      const store = new GeometryStore(props);

      store.addLayer(marker());

      expect(store.addLayer(marker())).toBe(true);
      expect(props.field.value.type).toBe('MultiPoint');
    });
  });

  describe('Refused geometries', () => {
    it('should refuse a type the instance cannot store', () => {
      const props = formikProps();
      const store = new GeometryStore(props);

      store.addLayer(polygon());
      props.form.setFieldValue.mockClear();

      expect(store.addLayer(polygon())).toBe(false);
      expect(props.form.setFieldValue).not.toHaveBeenCalled();
      expect(props.field.value.type).toBe('Polygon');
    });

    it('should refuse a mix of types', () => {
      const props = formikProps();
      const store = new GeometryStore(props);

      store.addLayer(marker());

      expect(store.addLayer(polygon())).toBe(false);
      expect(props.field.value.type).toBe('Point');
    });

    it('should not keep the refused layer', () => {
      const props = formikProps();
      const store = new GeometryStore(props);

      store.addLayer(marker());
      store.addLayer(polygon());

      // The next drawing is judged against what is stored, not against the
      // refused layer. So a second point is still a MultiPoint, not a
      // GeometryCollection of point, polygon and point
      expect(store.addLayer(marker())).toBe(true);
      expect(props.field.value.type).toBe('MultiPoint');
    });

    it('should report the refused type and what is accepted', () => {
      const onRejected = jest.fn();
      const store = new GeometryStore(formikProps(), false, { onRejected });

      store.addLayer(marker());
      store.addLayer(polygon());

      expect(onRejected).toHaveBeenLastCalledWith({
        type: 'GeometryCollection',
        allowedTypes: ['Point', 'MultiPoint', 'Polygon'],
      });
    });

    it('should clear the report once a geometry is stored', () => {
      const onRejected = jest.fn();
      const store = new GeometryStore(formikProps(), false, { onRejected });

      store.addLayer(marker());

      expect(onRejected).toHaveBeenLastCalledWith(null);
    });
  });

  describe('Instance configuration', () => {
    it('should store what the instance says it accepts', () => {
      const props = formikProps();
      const store = new GeometryStore(props, false, {
        geometryTypes: ['Polygon', 'MultiPolygon'],
      });

      store.addLayer(polygon());

      expect(store.addLayer(polygon())).toBe(true);
      expect(props.field.value.type).toBe('MultiPolygon');
    });

    it('should refuse an imported file it cannot store', () => {
      const props = formikProps();
      const store = new GeometryStore(props);

      const stored = store.loadGeoJSON([
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [0, 0] },
        },
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [0, 0],
              [1, 1],
            ],
          },
        },
      ]);

      expect(stored).toBe(false);
      expect(props.form.setFieldValue).not.toHaveBeenCalled();
    });
  });
});
