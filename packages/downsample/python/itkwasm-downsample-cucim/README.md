# itkwasm-downsample-cucim

[![PyPI version](https://badge.fury.io/py/itkwasm-downsample-cucim.svg)](https://badge.fury.io/py/itkwasm-downsample-cucim)

Pipelines for downsampling images. [cucim](https://pypi.org/project/cucim/) implementation.

This package provides the NVIDIA RAPIDS cuCIM CUDA-accelerated implementation. It is usually not called directly. Please use [`itkwasm-downsample`](https://pypi.org/project/itkwasm-downsample/) instead.

## Installation

[Install cuCIM](https://github.com/rapidsai/cucim?tab=readme-ov-file#install-cucim), then

```sh
pip install itkwasm-downsample-cucim
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
