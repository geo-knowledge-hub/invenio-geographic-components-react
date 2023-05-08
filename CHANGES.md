# Changes

## Version 0.2.3 (2023-05-08)

- Fixed `LocationsModal` version to be used with Invenio Forms;
- Updated dependencies.

## Version 0.2.2 (2023-02-12)

- Updated Invenio Form components.

## Version 0.2.1 (2022-07-19)

- Fixed the data load operation in the `GeographicIdentifiersField` component.

## Version 0.2.0 (2022-07-17)

- Package review
  - Package renamed from `geo-metadata-previewer-react` to `invenio-geographic-components-react`;
  - The classes and the concepts used in the package are now refactored;
  - [Storybook](https://storybook.js.org/) is now used to make the development/test easier to use and understand;
  - Componentes for specific pages of the InvenioRDM are now handled using the `contrib` concept.
 
- Introduced features
  - **Loaders**
    - Specialized components to enable users to load data from different sources;
    - Supported sources:
      - `GeoJSON file`: Using the GeoJSON loader, the users can upload a GeoJSON file. The validation of the GeoJSON loaded is performed using the [GeoJSON Hint](https://github.com/mapbox/geojsonhint).
	
  - **Simplifiers**
    - Specialized component to enable users to apply geometry simplification on the fly;
    - Supported simplification methods:
      - [Bounding box](https://turfjs.org/docs/#bbox);
      - [Convex Hull](https://turfjs.org/docs/#convex).
    - The simplifiers are implemented using only [turf.js](https://turfjs.org/docs/) functions.

  - **Reusable Formik field components**
    - `GeometryField`: Formik Field to define geometries using an interactive map. `Data loading` and `data simplification` are supported via `Loaders` and `Simplifiers`;
    - `GeographicIdentifiersField`: Formik Field to define Geographic Identifiers. This component uses the endpoint provided by the [Invenio Geographic Identifiers](https://github.com/geo-knowledge-hub/invenio-geographic-identifiers) module;
    - `LocationsField`: Formik Field to define Locations data (based on `GeometryField` and `GeographicIdentifiersField`). The format of the Location follows the [InvenioRDM metadata specification](https://inveniordm.docs.cern.ch/reference/metadata/#locations-0-n).
  
  - **Contrib module**
    - Record Landing page:
    	- `GeographicMetadataLocationViewer`: Component to enable the visualization of the Locations Field in the Record Landing Page using an Interactive Map.
    	
    - Deposit page:
    	- `LocationsFieldSerializer`: Helper class to serialize the Locations field in the InvenioRDM deposit page.

## Version 0.1.1-alpha (2022-05-09)

- Package renamed to `@geo-knowledge-hub/geo-metadata-previewer-react` using [scoped pattern](https://docs.npmjs.com/cli/v8/using-npm/scope)

## Version 0.1.0-alpha (2022-04-29)

- Initial package version (Alpha version);
- Added geospatial interactive visualizer for InvenioRDM Records ([Locations field](https://inveniordm.docs.cern.ch/reference/metadata/#locations-0-n)).
