## Invenio Geographic Components

Python package to enhance the distribution and usage of the [Invenio Geographic Components](https://github.com/geo-knowledge-hub/invenio-geographic-components-react).

## Development

To develop this package, first clone the repository:

```shell
git clone https://github.com/geo-knowledge-hub/invenio-geographic-components-react
```

Next, change to the directory of the Python package:

```shell
cd invenio-geographic-components-react/python
```

Then install the package with its test dependencies:

```shell
pip install -e ".[tests]"
```

Run the tests with the script `run-tests.sh`. It rebuilds the bundles, checks the manifest and runs pytest, so it is the one command to use before opening a pull request:

```shell
./run-tests.sh
```

## Documentation

To learn more about the installation, configuration and usage of this Python module, please check the [GEO Knowledge Hub documentation](https://gkhub.earthobservations.org/doc/development/extensions/geographic-components/).

## License

`Invenio Geographic Components` is distributed under the MIT license. See [LICENSE](./LICENSE) for the full text.
