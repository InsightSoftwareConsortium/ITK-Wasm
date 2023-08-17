# itkwasm-dicom-emscripten

[![PyPI version](https://badge.fury.io/py/itkwasm-dicom-emscripten.svg)](https://badge.fury.io/py/itkwasm-dicom-emscripten)

Read files and images related to DICOM file format. Emscripten implementation.

This package provides the Emscripten WebAssembly implementation. It is usually not called directly. Please use [`itkwasm-dicom`](https://pypi.org/project/itkwasm-dicom/) instead.


## Installation

```sh
import micropip
await micropip.install('itkwasm-dicom-emscripten')
```

## Development

```sh
# Download test data
cd ../../../..
npm ci
npm run build:testData
cd -

pip install hatch
hatch run download-pyodide
hatch run test
```
