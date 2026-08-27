# -*- coding: utf-8 -*-
#
# This file is part of Invenio-Geographic-Components.
# Copyright (C) 2022-2026 GEO Secretariat.
#
# Invenio-Geographic-Components is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more details.

"""Tests for geographic components views."""

import json
import re


#
# Constant - Sidebar template path
#
SIDE_BAR_TEMPLATE = (
    "semantic-ui/invenio_geographic_components"
    "/records/details/side_bar/locations_map.html"
)


#
# Constant - Deposit map configuration template path
#
DEPOSIT_MAP_CONFIG_TEMPLATE = (
    "semantic-ui/invenio_geographic_components/records/deposit/map_config.html"
)


#
# Auxiliary function
#
def _render(app, features):
    """Render the sidebar template over a set of location features."""
    app.jinja_env.add_extension("jinja2.ext.i18n")
    app.jinja_env.install_null_translations()

    with app.test_request_context():
        return app.jinja_env.get_template(SIDE_BAR_TEMPLATE).render(features=features)


def _render_deposit_map_config(app):
    """Render the template carrying the map configuration to the deposit form."""
    with app.test_request_context():
        return app.jinja_env.get_template(DEPOSIT_MAP_CONFIG_TEMPLATE).render()


#
# Tests
#
def test_config_defaults(app):
    """Test blueprint registration."""
    assert app.config["GEOGRAPHIC_COMPONENTS_MAP_CONFIG"]["useTileLayers"] is True
    assert app.config["GEOGRAPHIC_COMPONENTS_IDENTIFIERS_API_URL"] == (
        "/api/geoidentifiers"
    )


def test_template_is_available(app):
    """Test sidebar template availability."""
    with app.app_context():
        assert app.jinja_env.get_template(SIDE_BAR_TEMPLATE)


def test_template_renders_a_drawable_location(app):
    """Test that a location carrying a geometry is shown."""
    features = [
        {
            "place": "Somewhere",
            "geometry": {
                "type": "Point",
                "coordinates": [0, 0],
            },
        },
    ]

    assert "invenio-locations-map" in _render(app, features)


def test_template_renders_an_identifier_only_location(app):
    """Test that a location naming a place but drawing nothing is shown."""
    features = [
        {
            "identifiers": [
                {
                    "scheme": "geonames",
                    "identifier": "geonames::3448439",
                },
            ],
        },
    ]

    rendered = _render(app, features)

    assert "invenio-locations-map" in rendered
    assert "geonames::3448439" in rendered
    assert "/api/geoidentifiers" in rendered


def test_template_renders_nothing_it_cannot_show(app):
    """Test that a location with nothing to draw and no place is left out."""
    undrawable = [
        {
            "place": "Somewhere",
        },
        {
            "place": "Elsewhere",
            "geometry": {
                "type": "Polygon",
                "coordinates": None,
            },
        },
    ]

    assert "invenio-locations-map" not in _render(app, undrawable)


def test_prebuilt_assets_are_served(app):
    """Test pre-built assets availability."""
    assets = (
        "/static/extensions/geographic-components/invenio_geographic_components/locations-viewer.js",
        "/static/extensions/geographic-components/invenio_geographic_components/locations-viewer.css",
    )

    for path in assets:
        assert app.test_client().get(path).status_code == 200


def test_deposit_map_config_template_is_available(app):
    """Test deposit map configuration template availability."""
    with app.app_context():
        assert app.jinja_env.get_template(DEPOSIT_MAP_CONFIG_TEMPLATE)


def test_deposit_map_config_carries_the_watermark_position(app):
    """Test that a watermark position set by the instance reaches the form."""
    app.config["GEOGRAPHIC_COMPONENTS_MAP_CONFIG"] = {"watermarkPosition": "topleft"}

    assert '"watermarkPosition": "topleft"' in _render_deposit_map_config(app)


def test_deposit_map_config_carries_a_hidden_watermark(app):
    """Test that a watermark the instance takes away reaches the form as null."""
    app.config["GEOGRAPHIC_COMPONENTS_MAP_CONFIG"] = {"watermarkPosition": None}

    assert '"watermarkPosition": null' in _render_deposit_map_config(app)
