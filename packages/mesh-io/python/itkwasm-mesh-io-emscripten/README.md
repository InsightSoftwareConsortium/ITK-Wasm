# itkwasm-mesh-io-emscripten

[![PyPI version](https://badge.fury.io/py/itkwasm-mesh-io-emscripten.svg)](https://badge.fury.io/py/itkwasm-mesh-io-emscripten)

Input and output for scientific and medical image file formats. Emscripten implementation.

This package provides the Emscripten WebAssembly implementation. It is usually not called directly. Please use the [`itkwasm-mesh-io`](https://pypi.org/project/itkwasm-mesh-io/) instead.


## Installation

```sh
import micropip
await micropip.install('itkwasm-mesh-io-emscripten')
```

## Development

```sh
pip install hatch
hatch run download-pyodide
hatch run test
```
