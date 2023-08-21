# itkwasm-compare-images-emscripten

[![PyPI version](https://badge.fury.io/py/itkwasm-compare-images-emscripten.svg)](https://badge.fury.io/py/itkwasm-compare-images-emscripten)

Compare images with a tolerance for regression testing. Emscripten implementation.

This package provides the Emscripten WebAssembly implementation. It is usually not called directly. Please use the [`itkwasm-compare-images`](https://pypi.org/project/itkwasm-compare-images/) instead.


## Installation

```sh
import micropip
await micropip.install('itkwasm-compare-images-emscripten')
```

## Development

```sh
pip install hatch
hatch run download-pyodide
hatch run test
```
