# PiRestAngular

This library is used to provide the service PiApiCaller, which is a helper over HttpClient to make it easier the REST API calling.

- It is the counterpart of the [pirest](https://github.com/pomgui/pirest) library used in server applications.
- The [picodegen](https://github.com/pomgui/pirest-codegen) tool generates code that uses the PiApiCaller to make the calls, validate, and interpret the results.

## Build

Run `ng build pirest-angular` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io). The unit tests will be executed extracting the code coverage report (into the /coverage directory).
