/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';

import { InteractiveMap } from './InteractiveMap';

/**
 * GeospatialMetadataVisualizer
 *
 * @summary Component to visualize the Locations field from InvenioRDM Records.
 */
export const GeospatialMetadataVisualizer = ({
  mapContainerOptions,
  recordContext,
}) => {
  if (
    _.isEmpty(recordContext) ||
    !_.get(recordContext, 'metadata.locations', null)
  ) {
    throw new Error('You must provide a record with the locations defined.');
  }

  // organizing the locations
  let recordLocationsObject = {};
  const recordLocations = recordContext.metadata.locations;

  if (!_.isEmpty(recordLocations)) {
    // getting the locations that have an spatial geometry associated
    const recordLocationsWithGeometry = recordLocations.features.filter(
      (item) => {
        return _.has(item, 'geometry');
      }
    );

    // preparing the GeoJSON object.
    recordLocationsObject = {
      type: 'FeatureCollection',
      features: recordLocationsWithGeometry.map((x) => {
        return { type: 'Feature', ...x };
      }),
    };
  }

  return (
    <InteractiveMap
      mapContainerOptions={mapContainerOptions}
      geoJSONData={recordLocationsObject}
    />
  );
};

GeospatialMetadataVisualizer.propTypes = {
  recordContext: PropTypes.object,
  mapContainerOptions: PropTypes.object,
};

GeospatialMetadataVisualizer.defaultProps = {
  recordContext: {},
  mapContainerOptions: {
    id: 'map-container',
    scrollWheelZoom: false,
  },
};
