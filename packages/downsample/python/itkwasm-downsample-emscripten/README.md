# itkwasm-downsample-emscripten

[![PyPI version](https://badge.fury.io/py/itkwasm-downsample-emscripten.svg)](https://badge.fury.io/py/itkwasm-downsample-emscripten)

Pipelines for downsampling images. Emscripten implementation.

This package provides the Emscripten WebAssembly implementation. It is usually not called directly. Please use the [`itkwasm-downsample`](https://pypi.org/project/itkwasm-downsample/) instead.


## Installation

```sh
import micropip
await micropip.install('itkwasm-downsample-emscripten')
```

## Development

```sh
pip install hatch
hatch run download-pyodide
hatch run test
```
