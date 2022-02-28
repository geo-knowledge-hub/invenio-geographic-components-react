// This file is part of GEO Metadata Previewer React
// Copyright (C) 2022 GEO Secretariat.
//
// GEO Metadata Previewer is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";

import { InteractiveMap } from "../lib";

import "./App.css";

class App extends Component {
  render() {
    // defining the properties
    const geoJSONData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [6.214485168457031, 46.23780244949404],
                [6.288299560546875, 46.23780244949404],
                [6.288299560546875, 46.275783689088],
                [6.214485168457031, 46.275783689088],
                [6.214485168457031, 46.23780244949404],
              ],
            ],
          },
        },
      ],
    };

    return (
      <InteractiveMap
        mapContainerOptions={{
          id: "map-container",
          scrollWheelZoom: true,
        }}
        geoJSONData={geoJSONData}
      />
    );
  }
}

export default App;
