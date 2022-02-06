
// This file is part of GEO Feedback React
// Copyright (C) 2022 GEO Secretariat.
//
// Geospatial Metadata Viewer is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";

import { BaseMap } from "../lib";
import "leaflet/dist/leaflet.css";

import "./App.css";

class App extends Component {
    render() {


        // defining the properties
        const zoomMap = 12;
        const centerMap = [46.256321590140196, 6.210365295410156];
        const geoJsonData = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [
                                    6.214485168457031,
                                    46.23780244949404
                                ],
                                [
                                    6.288299560546875,
                                    46.23780244949404
                                ],
                                [
                                    6.288299560546875,
                                    46.275783689088
                                ],
                                [
                                    6.214485168457031,
                                    46.275783689088
                                ],
                                [
                                    6.214485168457031,
                                    46.23780244949404
                                ]
                            ]
                        ]
                    }
                }
            ]
        };

        return (
           <BaseMap
            zoomMap={zoomMap}
            centerMap={centerMap}
            geoJsonData={geoJsonData}
           ></BaseMap>
        )
    }
}

export default App;
