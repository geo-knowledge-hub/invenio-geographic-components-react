/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { LayersControl, TileLayer, useMap } from 'react-leaflet';
import './TileLayerControl.css';

/**
 * @typedef TileLayerObject
 * @type {Object}
 * @property {string} baseLayer Leaflet.LayersControl.BaseLayer options
 * @property {string} tileLayer TileLayer title
 */

/**
 * Default tile layers used in the TileLayerControl component.
 *
 * @type Array.<TileLayerObject>
 */
export const DefaultTileLayers = [
  {
    baseLayer: {
      name: 'Esri World Imagery',
    },
    tileLayer: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 17,
    },
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  {
    baseLayer: {
      checked: true,
      name: 'Open Street Map',
    },
    tileLayer: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      maxZoom: 17,
    },
    attribution:
      "Map data: &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
  },
  {
    baseLayer: {
      name: 'OpenTopoMap',
    },
    tileLayer: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      maxZoom: 17,
    },
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  },
];

/**
 * Tile Layer control. This controller enables users to define multiple Tile Layer at once.
 * @constructor
 *
 * @param {Array.<TileLayerObject>} tileLayers
 * @param layersControlConfig
 * @returns {JSX.Element}
 *
 */
export const TileLayerControl = ({ tileLayers, layersControlConfig }) => {
  /**
   * Map object
   */
  const map = useMap();

  /**
   * States
   */
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [isHoveringControl, setIsHoveringControl] = useState(false);
  const [isHoveringPopup, setIsHoveringPopup] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  /**
   * Auxiliary functions
   */

  /**
   * The layers control of this map
   *
   * A page can hold more than one map. The deposit form opens its editor over
   * the landing page in the same document. So the control is looked up inside
   * this map's container rather than in the whole document
   */
  const controlElement = () => {
    return map.getContainer().querySelector('.leaflet-control-layers');
  };

  const togglePopup = (attribution) => {
    setPopupContent(attribution);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setPopupContent('');
  };

  /**
   * Effects - Manage the credits button
   */
  useEffect(() => {
    // Get the layers control
    const layersControl = controlElement();

    // If the layers control is not found,
    // return undefined
    if (!layersControl) {
      return undefined;
    }

    // Handle the click event
    const handleClick = (event) => {
      const button = event.target.closest?.('.leaflet-control-layers-button');

      if (!button) {
        return;
      }

      // Each item is a `<label>`, so a click anywhere inside it also
      // selects the base map. The credits button should not change the map
      event.preventDefault();
      event.stopPropagation();

      togglePopup(tileLayers[Number(button.dataset.layerIndex)].attribution);
    };

    layersControl.addEventListener('click', handleClick);

    return () => layersControl.removeEventListener('click', handleClick);
  }, [map, tileLayers]);

  /**
   * Effects - Manage popup based on user interaction
   */
  useEffect(() => {
    const layersControl = controlElement();

    const handleMouseEnter = () => {
      setIsHoveringControl(true);
      setIsTimerRunning(false);
    };

    const handleMouseLeave = () => {
      setIsHoveringControl(false);
      if (!isHoveringPopup) {
        setIsTimerRunning(true);
      }
    };

    if (layersControl) {
      layersControl.addEventListener('mouseenter', handleMouseEnter);
      layersControl.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (layersControl) {
        layersControl.removeEventListener('mouseenter', handleMouseEnter);
        layersControl.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isHoveringPopup]);

  /**
   * Effects - Automatic close credits popup
   */
  useEffect(() => {
    if (
      popupVisible &&
      !isHoveringPopup &&
      !isHoveringControl &&
      isTimerRunning
    ) {
      const timer = setTimeout(() => closePopup(), 5000);
      return () => clearTimeout(timer);
    }
  }, [popupVisible, isHoveringPopup, isHoveringControl, isTimerRunning]);

  /**
   * Effects - Close popup when base layer changes
   */
  useEffect(() => {
    const handleBaseLayerChange = () => closePopup();

    map.on('baselayerchange', handleBaseLayerChange);

    return () => {
      map.off('baselayerchange', handleBaseLayerChange);
    };
  }, [map]);

  return (
    <>
      <LayersControl
        className="leaflet-control-layers-expanded"
        {...layersControlConfig}
      >
        {tileLayers.map((tileLayer, index) => (
          <LayersControl.BaseLayer
            key={index}
            checked={index === 0}
            name={`
              <div class="leaflet-control-layers-item">
                <span>${tileLayer.baseLayer.name}</span>
                <button
                  type="button"
                  class="leaflet-control-layers-button"
                  data-layer-index="${index}"
                >
                  Credits
                </button>
              </div>
            `}
          >
            <TileLayer {...tileLayer.tileLayer} />
          </LayersControl.BaseLayer>
        ))}
      </LayersControl>

      {popupVisible && (
        <div
          className="leaflet-control-popup"
          onMouseEnter={() => {
            setIsHoveringPopup(true);
            setIsTimerRunning(false);
          }}
          onMouseLeave={() => {
            setIsHoveringPopup(false);
            if (!isHoveringControl) {
              setIsTimerRunning(true);
            }
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: popupContent }} />
          <div>
            <button
              className="leaflet-control-popup-close"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

TileLayerControl.propTypes = {
  tileLayers: PropTypes.arrayOf(
    PropTypes.shape({
      baseLayer: PropTypes.object.isRequired,
      tileLayer: PropTypes.object.isRequired,
    })
  ),
  layersControlConfig: PropTypes.object,
};

TileLayerControl.defaultProps = {
  tileLayers: DefaultTileLayers,
  layersControlConfig: {},
};
