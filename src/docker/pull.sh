#!/usr/bin/env bash

set -eo pipefail

docker pull itkwasm/emscripten-vtk-io:latest
docker pull itkwasm/emscripten-vtk-io:latest-debug

docker pull itkwasm/emscripten:latest
docker pull itkwasm/emscripten:latest-debug

docker pull itkwasm/wasi:latest
docker pull itkwasm/wasi:latest-debug
