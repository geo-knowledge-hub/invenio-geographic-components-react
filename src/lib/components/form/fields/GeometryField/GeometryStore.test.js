/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { Marker, Polygon } from 'leaflet';

import { SAO_PAULO_POINT, ZURICH_POINT } from '@tests/mock/spatial/points';

import { GEOMETRY_REJECTIONS, GeometryStore } from './GeometryStore';

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
        reason: GEOMETRY_REJECTIONS.UNSUPPORTED_TYPE,
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

  describe('Geometries that were not drawn', () => {
    it('should store a geometry on an empty store', () => {
      // Render the field
      const props = formikProps();
      const store = new GeometryStore(props);

      // Add the geometry
      expect(store.addGeometry(SAO_PAULO_POINT)).toBe(true);
      expect(props.field.value).toEqual(SAO_PAULO_POINT);
    });

    it('should add to what is already stored', () => {
      // Render the field
      const props = formikProps();
      const store = new GeometryStore(props);

      // Add the geometry
      store.addGeometry(SAO_PAULO_POINT);

      // Add the other geometry
      expect(store.addGeometry(ZURICH_POINT)).toBe(true);
      expect(props.field.value).toEqual({
        type: 'MultiPoint',
        coordinates: [SAO_PAULO_POINT.coordinates, ZURICH_POINT.coordinates],
      });
    });

    it('should add to what was drawn', () => {
      // Render the field
      const props = formikProps();
      const store = new GeometryStore(props);

      // Add the geometry
      store.addLayer(marker());

      // Add the other geometry
      expect(store.addGeometry(SAO_PAULO_POINT)).toBe(true);
      expect(props.field.value.type).toBe('MultiPoint');
    });

    it('should keep the geometry it has when only one is kept', () => {
      // Render the field
      const props = formikProps();
      const onRejected = jest.fn();
      const store = new GeometryStore(props, true, { onRejected });

      // Add the geometry
      store.addGeometry(SAO_PAULO_POINT);

      // Add the other geometry
      expect(store.addGeometry(ZURICH_POINT)).toBe(false);
      expect(props.field.value).toEqual(SAO_PAULO_POINT);
      expect(onRejected).toHaveBeenLastCalledWith({
        reason: GEOMETRY_REJECTIONS.UNIQUE_LAYER,
      });
    });

    it('should keep what was drawn when only one geometry is kept', () => {
      // Render the field
      const props = formikProps();
      const store = new GeometryStore(props, true);

      // Add the geometry
      store.addLayer(polygon());

      expect(store.addGeometry(SAO_PAULO_POINT)).toBe(false);
      expect(props.field.value.type).toBe('Polygon');
    });

    it('should refuse a geometry it already has', () => {
      // Render the field
      const props = formikProps();
      const onRejected = jest.fn();
      const store = new GeometryStore(props, false, { onRejected });

      // Add the geometry
      store.addGeometry(SAO_PAULO_POINT);

      // Check if the geometry is refused
      expect(store.addGeometry(SAO_PAULO_POINT)).toBe(false);
      expect(props.field.value).toEqual(SAO_PAULO_POINT);
      expect(onRejected).toHaveBeenLastCalledWith({
        reason: GEOMETRY_REJECTIONS.DUPLICATE,
      });
    });

    it('should refuse a geometry it already has among others', () => {
      // Render the field
      const props = formikProps();
      const store = new GeometryStore(props);

      // Add the geometry
      store.addGeometry(SAO_PAULO_POINT);
      store.addGeometry(ZURICH_POINT);

      // Check if the geometry is refused
      expect(store.addGeometry(SAO_PAULO_POINT)).toBe(false);
      expect(props.field.value.coordinates).toHaveLength(2);
    });

    it('should refuse a geometry that was drawn rather than asked for', () => {
      // Render the field
      const props = formikProps();
      const store = new GeometryStore(props);

      // Add the geometry
      store.addLayer(marker());

      // Check if the geometry is refused
      expect(
        store.addGeometry({ type: 'Point', coordinates: [6.14, 46.2] })
      ).toBe(false);

      expect(props.field.value.type).toBe('Point');
    });

    it('should refuse a merge the instance cannot store', () => {
      // Render the field
      const props = formikProps();
      const onRejected = jest.fn();
      const store = new GeometryStore(props, false, { onRejected });

      // Add the geometry
      store.addLayer(polygon());

      // Check if the geometry is refused
      expect(store.addGeometry(SAO_PAULO_POINT)).toBe(false);
      expect(props.field.value.type).toBe('Polygon');

      expect(onRejected).toHaveBeenLastCalledWith({
        reason: GEOMETRY_REJECTIONS.UNSUPPORTED_TYPE,
        type: 'GeometryCollection',
        allowedTypes: ['Point', 'MultiPoint', 'Polygon'],
      });
    });

    it('should refuse an empty geometry', () => {
      // Render the field
      const props = formikProps();
      const store = new GeometryStore(props);

      // Check if the geometry is refused
      expect(store.addGeometry({})).toBe(false);
      expect(props.form.setFieldValue).not.toHaveBeenCalled();
    });

    it('should refuse a geometry while there is nowhere to put it', () => {
      // Render the field
      expect(new GeometryStore().addGeometry(SAO_PAULO_POINT)).toBe(false);
    });

    it('should hand the stored geometry back as a layer', () => {
      // Render the field
      const props = formikProps();
      const store = new GeometryStore(props);

      // Get the layers
      store.getLayers();
      store.addGeometry(SAO_PAULO_POINT);

      const layers = store.getLayers();

      expect(layers).toHaveLength(1);
      expect(layers[0].toGeoJSON().features[0].geometry).toEqual(
        SAO_PAULO_POINT
      );
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
