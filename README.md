# PiservicesAngular

This library is used to provide the service PiApiCaller, which is a helper over HttpClient to make it easier the REST API calling.

- It is the counterpart of the [piservices](https://github.com/pomgui/piservices) library used in server applications.
- The [picodegen](https://github.com/pomgui/piservices-codegen) tool generates code that uses the PiApiCaller to make the calls, validate, and interpret the results.

## Build

Run `ng build piservices-angular` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test piservices-angular` to execute the unit tests via [Karma](https://karma-runner.github.io).
Run `ng test piservices-angular --code-coverage` to execute the unit tests extracting the code coverage report (into the /coverage directory).
