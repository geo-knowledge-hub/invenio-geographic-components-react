# -*- coding: utf-8 -*-
#
# This file is part of Invenio-Geographic-Components.
# Copyright (C) 2022-2026 GEO Secretariat.
#
# Invenio-Geographic-Components is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more details.

"""Pytest fixtures."""

import pytest
from flask import Flask

from invenio_geographic_components.views import create_blueprint


@pytest.fixture()
def app():
    """Flask application."""
    app = Flask(__name__)
    app.register_blueprint(create_blueprint(app))

    return app
