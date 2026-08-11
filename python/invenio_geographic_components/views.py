# -*- coding: utf-8 -*-
#
# This file is part of Invenio-Geographic-Components.
# Copyright (C) 2022-2026 GEO Secretariat.
#
# Invenio-Geographic-Components is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more details.

"""Views of geographic components for InvenioRDM."""

from flask import Blueprint

from . import config


def create_blueprint(app):
    """Create the blueprint."""
    # Register default configuration values
    for key in dir(config):
        if key.startswith("GEOGRAPHIC_COMPONENTS_"):
            app.config.setdefault(key, getattr(config, key))

    # Create the blueprint
    return Blueprint(
        "invenio_geographic_components",
        __name__,
        template_folder="templates",
        static_folder="static",
        # Without an explicit path the blueprint would claim "/static" and
        # collide with the application static route. Serving the assets here
        # also means the landing page map works right after ``pip install``,
        # with no asset build.
        static_url_path="/static/extensions/geographic-components",
    )
