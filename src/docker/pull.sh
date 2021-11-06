#!/usr/bin/env bash

set -eo pipefail

docker pull kitware/itk-wasm-vtk:latest
docker pull kitware/itk-wasm-vtk:latest-debug

docker pull insighttoolkit/itk-wasi:latest
docker pull insighttoolkit/itk-wasi:latest-debug

docker pull insighttoolkit/itk-wasm:latest
docker pull insighttoolkit/itk-wasm:latest-debug
