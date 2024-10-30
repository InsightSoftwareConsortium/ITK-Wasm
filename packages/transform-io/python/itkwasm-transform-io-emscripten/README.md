# itkwasm-transform-io-emscripten

[![PyPI version](https://badge.fury.io/py/itkwasm-transform-io-emscripten.svg)](https://badge.fury.io/py/itkwasm-transform-io-emscripten)

Input and output for scientific and medical coordinate transform file formats. Emscripten implementation.

This package provides the Emscripten WebAssembly implementation. It is usually not called directly. Please use the [`itkwasm-transform-io`](https://pypi.org/project/itkwasm-transform-io/) instead.


## Installation

```sh
import micropip
await micropip.install('itkwasm-transform-io-emscripten')
```

## Development

```sh
pip install hatch
hatch run download-pyodide
hatch run test
```
