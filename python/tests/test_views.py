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


#
# Auxiliary function
#
def _render(app, features):
    """Render the sidebar template over a set of location features."""
    app.jinja_env.add_extension("jinja2.ext.i18n")
    app.jinja_env.install_null_translations()

    with app.test_request_context():
        return app.jinja_env.get_template(SIDE_BAR_TEMPLATE).render(features=features)


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
