// This file is part of GEO Feedback React
// Copyright (C) 2022 GEO Secretariat.
//
// Geospatial Metadata Viewer is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _ from "lodash";

import React, { Component } from "react";
import { useEffect, useRef } from "react";

import L from "leaflet";
import { useLeafletContext } from "@react-leaflet/core";

import { MapContainer, TileLayer } from "react-leaflet";

const GeoJSONGeometry = (props) => {
  const context = useLeafletContext();

  const propsRef = useRef(props);
  const geometryLayerRef = useRef();

  useEffect(() => {
    const container = context.layerContainer || context.map;

    // getting the geometry data and creating a geometry layer
    const geometryData = propsRef.current.geometryData;

    if (!_.isEmpty(geometryData)) {
      geometryLayerRef.current = L.geoJSON().addTo(container);
      geometryLayerRef.current.addData(geometryData);

      // adjusting the map bounds
      container.fitBounds(geometryLayerRef.current.getBounds());

      return () => {
        container.removeLayer(geometryLayerRef.current)
      }
    }
  }, [context]);

  return null;
};

export default class InteractiveMap extends Component {
  constructor(props) {
    super(props);

    // setting the default values
    this.mapDivId = props.mapDivId || "map";
    this.geoJSONData = props.geoJSONData || null;
    this.mapContainerOptions = props.mapContainerOptions || {
      scrollWheelZoom: false,
    };
  }

  render() {
    return (
      <MapContainer {...this.mapContainerOptions}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSONGeometry geometryData={this.geoJSONData} />
      </MapContainer>
    );
  }
}
