/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _compact from 'lodash/compact';
import _isEmpty from 'lodash/isEmpty';
import _uniqBy from 'lodash/uniqBy';

import { geoJSON } from 'leaflet';
import { MapContainer } from 'react-leaflet';

import { i18next } from '@translations/i18next';

import { GeometryMutator } from '../../../base/geometry/mutators';
import { containsGeometry } from '../../../base/geometry/predicates';
import { BaseMapLayers } from '../../../components/layers/base/BaseMapLayers';
import { GeoJSONLayer } from '../../../components/layers/base/GeoJSONLayer';
import { describe, geometryOf } from '../../../components/geoidentifiers';

import { IdentifierPlaces } from './IdentifierPlaces';
import { useIdentifierRecords } from './useIdentifierRecords';

/**
 * How close the map goes when a reader asks for one place.
 */
const PLACE_ZOOM = 8;

/**
 * The geometry a feature can be drawn from.
 *
 * A location may carry a place and no geometry at all, and InvenioRDM
 * serializes the geometry types it cannot represent with null coordinates.
 * Leaflet reads their length and throws, taking the whole map down with it.
 * Neither is drawable, so neither is passed on.
 *
 * @param {Object} feature Location feature.
 * @returns {Object|null} GeoJSON Geometry object, or `null`.
 */
const drawableGeometry = (feature) => {
  const geometry = _get(feature, 'geometry');

  if (_isNil(geometry) || _isEmpty(_get(geometry, 'coordinates'))) {
    return null;
  }

  return geometry;
};

/**
 * The geometries a stored one was built from.
 *
 * @param {Object} geometry GeoJSON Geometry object.
 * @returns {Array.<Object>} The parts, or the geometry itself when it is of a
 *                           type the mutator does not take apart.
 */
const explode = (geometry) => {
  const parts = GeometryMutator.generateGeometryExploded(geometry);

  return parts ? parts.map((feature) => feature.geometry) : [geometry];
};

/**
 * Geographic metadata locations viewer component to visualize in an interactive map the
 * `Locations` data in an InvenioRDM Record.
 * @constructor
 *
 * @param {Array} featuresData The Locations Features objects to be visualized in the interactive map.
 * @param {Object} mapConfig Configuration object for the `BaseMapLayers`.
 * @param {String} identifiersApiUrl API the Geographic Identifiers vocabulary is served
 *                                   from. Without it the places are not read back.
 * @returns {JSX.Element}
 */
export const GeographicMetadataLocationViewer = ({
  featuresData,
  mapConfig,
  identifiersApiUrl,
}) => {
  // State - The map instance
  const [map, setMap] = useState(null);

  // The layer a place was drawn as, so choosing it in the list can bring up what
  // the map already knows about it.
  const placeLayers = useRef({});

  // Get the unique identifiers
  const identifiers = _uniqBy(
    featuresData.flatMap((feature) => _get(feature, 'identifiers', [])),
    'identifier'
  );

  // Get the records
  const records = useIdentifierRecords(
    identifiersApiUrl ? identifiers : [],
    identifiersApiUrl
  );

  /**
   * The place a geometry stands for, when the record stored it from one.
   *
   * `Add to map` writes a place own point into the record, so the two are
   * routinely the same shape. Where they are, one is drawn and the list points
   * at it, rather than a second marker being stacked on the first.
   */
  const placeAt = (geometry) => {
    return _get(
      identifiers.find(({ identifier }) =>
        containsGeometry(geometry, geometryOf(records[identifier]))
      ),
      'identifier'
    );
  };

  // Get the record features
  const recordFeatures = featuresData.flatMap((feature) => {
    const geometry = drawableGeometry(feature);

    if (!geometry) {
      return [];
    }

    // Two places added to one location are stored as a single `MultiPoint`,
    // which is one shape to Leaflet and two places to a reader. It is taken
    // apart so each part can stand for the place it came from. The map draws
    // the same thing either way.
    return explode(geometry).map((part) => ({
      type: 'Feature',
      properties: {
        identifier: placeAt(part),
        place: _get(feature, 'place'),
        description: _get(feature, 'description'),
      },
      geometry: part,
    }));
  });

  // Get the drawn identifiers
  const drawn = _compact(
    recordFeatures.map(({ properties }) => properties.identifier)
  );

  // Get the place features
  const placeFeatures = _compact(
    identifiers.map(({ identifier }) => {
      const geometry = geometryOf(records[identifier]);

      if (!geometry || drawn.includes(identifier)) {
        return null;
      }

      return {
        type: 'Feature',
        properties: {
          identifier,
          place: records[identifier].name,
          description: describe(records[identifier]),
        },
        geometry,
      };
    })
  );

  // Get the features
  const features = [...recordFeatures, ...placeFeatures];

  // Select a place
  const selectPlace = (identifier) => {
    const geometry = geometryOf(records[identifier]);

    if (!map || !geometry) {
      return;
    }

    // Framed rather than centred on a coordinate pair, so a place the scheme
    // describes with something other than a point is framed too.
    map.flyToBounds(geoJSON(geometry).getBounds(), { maxZoom: PLACE_ZOOM });

    // Get the layer
    const layer = placeLayers.current[identifier];

    // Open the popup
    if (layer) {
      layer.openPopup();
    }
  };

  return (
    <>
      <MapContainer {...mapConfig.mapContainer} whenCreated={setMap}>
        <BaseMapLayers {...mapConfig} />

        {features.length > 0 && (
          <GeoJSONLayer
            key={`places-${placeFeatures.length}`}
            geoJsonData={{ type: 'FeatureCollection', features }}
            fitBoundsOptions={mapConfig.fitBoundsOptions}
            options={{
              onEachFeature: (feature, layer) => {
                const identifier = _get(feature, 'properties.identifier');

                if (identifier) {
                  placeLayers.current[identifier] = layer;
                }

                const placeText = _get(feature, 'properties.place', '');
                const descriptionText = _get(
                  feature,
                  'properties.description',
                  ''
                );

                if (placeText || descriptionText) {
                  layer.bindPopup(`
                    <h4>${placeText}</h4>
                    <p>${descriptionText}</p>
                  `);
                } else {
                  layer.bindPopup(
                    i18next.t(
                      "This geometry doesn't have any extra information"
                    )
                  );
                }
              },
            }}
          />
        )}
      </MapContainer>

      <IdentifierPlaces
        identifiers={identifiers}
        records={records}
        onSelect={selectPlace}
      />
    </>
  );
};

GeographicMetadataLocationViewer.propTypes = {
  featuresData: PropTypes.array,
  mapConfig: PropTypes.object,
  identifiersApiUrl: PropTypes.string,
};

GeographicMetadataLocationViewer.defaultProps = {
  featuresData: [],
  mapConfig: {},
  identifiersApiUrl: '/api/geoidentifiers',
};
