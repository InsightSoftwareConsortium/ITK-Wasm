#!/usr/bin/env bash

set -eo pipefail

docker pull kitware/itk-wasm-vtk:latest
docker pull kitware/itk-wasm-vtk:latest-debug

docker pull itkwasm/wasi:latest
docker pull itkwasm/wasi:latest-debug

docker pull itkwasm/emscripten:latest
docker pull itkwasm/emscripten:latest-debug
