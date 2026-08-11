# Invenio Geographic Components

[![License](https://img.shields.io/github/license/geo-knowledge-hub/invenio-geographic-components-react.svg)](https://github.com/geo-knowledge-hub/invenio-geographic-components-react/blob/master/LICENSE)

Geographic components for InvenioRDM instances.

## Structure

`Invenio Geographic Components` is a React library providing high-level geographic components for InvenioRDM instances, allowing users to easily create and visualize [Locations](https://inveniordm.docs.cern.ch/reference/metadata/#locations-0-n). To facilitate the installation and configuration of the components, a Python library is also provided, with all the assets required to install the components in an InvenioRDM instance.

The usage of the Python library in an InvenioRDM instance doesn't increase the build time, as the Python package already includes pre-compiled versions of the React components.

## Getting started (in Python)

To start, you first need to install the Python distribution in your instance. For this, you can use your favorite package manager. Assuming you are using the default pipenv from InvenioRDM, you can add the package to the `Pipfile` of your instance as follows:

> Currently, the package is only available on GitHub, but soon it will be available on PyPI.org as well.

```toml
[packages]
invenio-geographic-components = {git = "https://github.com/geo-knowledge-hub/invenio-geographic-components-react.git", subdirectory = "python"}
```

Once it is installed, you can configure it. For this, in your `invenio.cfg`, include the sidebar template:

```python
from invenio_app_rdm.config import APP_RDM_DETAIL_SIDE_BAR_TEMPLATES as _SIDE_BAR

APP_RDM_DETAIL_SIDE_BAR_TEMPLATES = [
    "invenio_geographic_components/records/details/side_bar/locations_map.html"
    if template.endswith("side_bar/locations.html")
    else template
    for template in _SIDE_BAR
]
```

Next, you need to include in your `invenio.cfg` file an extra configuration for the content security policy, so that images from the tile servers used in the map components are allowed:

```python
from invenio_geographic_components.config import GEOGRAPHIC_COMPONENTS_TILE_HOSTS

APP_DEFAULT_SECURE_HEADERS["content_security_policy"]["img-src"] = [
    "'self'",
    "data:",
    "blob:",
    *GEOGRAPHIC_COMPONENTS_TILE_HOSTS,
]
```

Then install and rebuild the web assets:

```shell
invenio-cli install
invenio-cli assets build
```

The map options, the deposit form field and the notes for InvenioRDM v13 are covered in the [documentation](https://gkhub.earthobservations.org/doc/development/extensions/geographic-components/).

## Development

As mentioned, the repository holds two projects. The React sources are in `src/`, and the Python distribution is in `python/`. The build writes its bundles into the Python package, and that output is committed, so rebuild and commit it with any source change.

```shell
npm install
npm run build       # build the bundles
npm test            # component tests
npm run storybook   # component playground
```

While developing, `npm run watch` rebuilds on save, and the linter and formatter keep the sources consistent:

```shell
npm run watch
npm run lint
npm run format
```

The Python side has its own instructions in [`python/README.md`](python/README.md).

## Contributing

Contributions are welcome. Please open an issue to discuss significant changes, and ensure tests, linting and type checks pass before submitting a pull request.

## License

`Invenio Geographic Components` is distributed under the MIT license. See [LICENSE](./LICENSE) for the full text.
