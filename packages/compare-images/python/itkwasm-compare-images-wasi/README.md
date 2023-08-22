# itkwasm-compare-images-wasi

[![PyPI version](https://badge.fury.io/py/itkwasm-compare-images-wasi.svg)](https://badge.fury.io/py/itkwasm-compare-images-wasi)

Compare images with a tolerance for regression testing. WASI implementation.

This package provides the WASI WebAssembly implementation. It is usually not called directly. Please use [`itkwasm-compare-images`](https://pypi.org/project/itkwasm-compare-images/) instead.


## Installation

```sh
pip install itkwasm-compare-images-wasi
```

## Development

```sh
pip install pytest itk-webassemblyinterface>=1.0b127
pip install -e .
pytest

# or
pip install hatch
hatch run test
```
