# -*- coding: utf-8 -*-
#
# This file is part of Invenio-Geographic-Components.
# Copyright (C) 2022-2026 GEO Secretariat.
#
# Invenio-Geographic-Components is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more details.

"""Configuration."""

GEOGRAPHIC_COMPONENTS_MAP_CONFIG = {
    "mapContainer": {
        "center": [0, 0],
        "zoom": 2,
        "scrollWheelZoom": False,
    },
    "fitBoundsOptions": {
        "maxZoom": 12
    },
    "useTileLayers": True,
    "useFullscreen": True,
    "useGeocoding": False,
    "useMouseCoordinate": False,
}
"""Options passed to the landing page map.

Note: The parameters ``center`` and ``zoom`` are required by Leaflet.
"""

GEOGRAPHIC_COMPONENTS_TILE_HOSTS = [
    "https://server.arcgisonline.com",
    "https://*.tile.openstreetmap.org",
    "https://*.tile.opentopomap.org",
]
"""Hosts serving the default base maps.

The InvenioRDM Content-Security-Policy only allows same-origin images, so these
have to be added to ``APP_DEFAULT_SECURE_HEADERS`` for the base maps to load.
"""
