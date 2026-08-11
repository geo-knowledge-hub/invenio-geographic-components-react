# -*- coding: utf-8 -*-
#
# This file is part of Invenio-Geographic-Components.
# Copyright (C) 2022-2026 GEO Secretariat.
#
# Invenio-Geographic-Components is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more details.

"""Tests for geographic components views."""


#
# Constant - Sidebar template path
#
SIDE_BAR_TEMPLATE = (
    "semantic-ui/invenio_geographic_components"
    "/records/details/side_bar/locations_map.html"
)


def test_config_defaults(app):
    """Test blueprint registration."""
    assert app.config["GEOGRAPHIC_COMPONENTS_MAP_CONFIG"]["useTileLayers"] is True


def test_template_is_available(app):
    """Test sidebar template availability."""
    with app.app_context():
        assert app.jinja_env.get_template(SIDE_BAR_TEMPLATE)


def test_prebuilt_assets_are_served(app):
    """Test pre-built assets availability."""
    assets = (
        "/static/extensions/geographic-components/invenio_geographic_components/locations-viewer.js",
        "/static/extensions/geographic-components/invenio_geographic_components/locations-viewer.css",
    )

    for path in assets:
        assert app.test_client().get(path).status_code == 200
