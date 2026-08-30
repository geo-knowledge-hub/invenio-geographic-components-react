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
# Constant - Deposit configuration template path
#
DEPOSIT_CONFIG_TEMPLATE = (
    "semantic-ui/invenio_geographic_components/records/deposit/deposit_config.html"
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


def _render_deposit_config(app):
    """Read back the configuration the deposit form template carries.

    The template writes a JSON document into a script tag, so the assertions are
    made on what the form will read, rather than on how it is spelled.
    """
    with app.test_request_context():
        rendered = app.jinja_env.get_template(DEPOSIT_CONFIG_TEMPLATE).render()

    return json.loads(re.search(r"<script[^>]*>(.*?)</script>", rendered, re.S).group(1))


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


def test_deposit_config_template_is_available(app):
    """Test deposit configuration template availability."""
    with app.app_context():
        assert app.jinja_env.get_template(DEPOSIT_CONFIG_TEMPLATE)


def test_deposit_config_carries_the_defaults(app):
    """Test that the form is given both configurations the instance registered."""
    config = _render_deposit_config(app)

    assert config["mapConfig"]["useTileLayers"] is True
    assert config["identifiersApiUrl"] == "/api/geoidentifiers"


def test_deposit_config_carries_the_watermark_position(app):
    """Test that a watermark position set by the instance reaches the form."""
    app.config["GEOGRAPHIC_COMPONENTS_MAP_CONFIG"] = {"watermarkPosition": "topleft"}

    assert _render_deposit_config(app)["mapConfig"] == {"watermarkPosition": "topleft"}


def test_deposit_config_carries_a_hidden_watermark(app):
    """Test that a watermark the instance takes away reaches the form as null."""
    app.config["GEOGRAPHIC_COMPONENTS_MAP_CONFIG"] = {"watermarkPosition": None}

    assert _render_deposit_config(app)["mapConfig"]["watermarkPosition"] is None


def test_deposit_config_carries_the_identifiers_api(app):
    """Test that a vocabulary served elsewhere reaches the form."""
    app.config["GEOGRAPHIC_COMPONENTS_IDENTIFIERS_API_URL"] = "/api/places"

    assert _render_deposit_config(app)["identifiersApiUrl"] == "/api/places"


def test_deposit_config_cannot_be_broken_out_of(app):
    """Test that a configured value cannot close the script tag it is written in."""
    app.config["GEOGRAPHIC_COMPONENTS_IDENTIFIERS_API_URL"] = "</script><script>x"

    # The value is read back whole, which is only possible if the tag held
    assert _render_deposit_config(app)["identifiersApiUrl"] == "</script><script>x"
