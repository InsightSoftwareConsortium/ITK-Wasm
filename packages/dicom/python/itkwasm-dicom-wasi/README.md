# itkwasm-dicom-wasi

[![PyPI version](https://badge.fury.io/py/itkwasm-dicom-wasi.svg)](https://badge.fury.io/py/itkwasm-dicom-wasi)

Read files and images related to DICOM file format. WASI implementation.

This package provides the WASI WebAssembly implementation. It is usually not called directly. Please use [`itkwasm-dicom`](https://pypi.org/project/itkwasm-dicom/) instead.


## Installation

```sh
pip install itkwasm-dicom-wasi
```

## Development

```sh
# Download test data
cd ../..
pnpm test:data:download
cd -

pip install pytest
pip install pillow
pip install -e .
pytest
# or
pip install hatch
hatch run test
```
