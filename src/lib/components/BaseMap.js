// This file is part of GEO Feedback React
// Copyright (C) 2022 GEO Secretariat.
//
// Geospatial Metadata Viewer is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

export default class BaseMap extends Component {

    render () {
        const { centerMap, zoomMap, geoJsonData } = this.props;

        return (
                <MapContainer center={centerMap} zoom={zoomMap} scrollWheelZoom={false} id="map">
                  <GeoJSON data={geoJsonData}/>
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                </MapContainer>
        );
    }
}
