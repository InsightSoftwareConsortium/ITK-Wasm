# itkwasm-downsample-wasi

[![PyPI version](https://badge.fury.io/py/itkwasm-downsample-wasi.svg)](https://badge.fury.io/py/itkwasm-downsample-wasi)

Pipelines for downsampling images. WASI implementation.

This package provides the WASI WebAssembly implementation. It is usually not called directly. Please use [`itkwasm-downsample`](https://pypi.org/project/itkwasm-downsample/) instead.


## Installation

```sh
pip install itkwasm-downsample-wasi
```

## Development

```sh
pip install pytest itkwasm-image-io itkwasm-compare-images
pip install -e .
pytest

# or
pip install hatch
hatch run test
```
