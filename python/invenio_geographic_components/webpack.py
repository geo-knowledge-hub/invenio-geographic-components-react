# -*- coding: utf-8 -*-
#
# This file is part of Invenio-Geographic-Components.
# Copyright (C) 2022-2026 GEO Secretariat.
#
# Invenio-Geographic-Components is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more details.

"""Webpack bundle for geographic components."""

from invenio_assets.webpack import WebpackThemeBundle

theme = WebpackThemeBundle(
    __name__,
    "assets",
    default="semantic-ui",
    themes={
        "semantic-ui": dict(
            # No entry points: this bundle only makes the pre-built modules
            # importable from other bundles through the alias below.
            entry={},
            # The pre-built module already contains the geospatial stack
            # (i.e., Leaflet, Turf, Geoman, and others). Everything else it imports is
            # part of InvenioRDM. Instances install nothing extra.
            dependencies={},
            aliases={
                "@js/invenio_geographic_components": "js/invenio_geographic_components",
            },
        ),
    },
)
