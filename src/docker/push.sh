#!/usr/bin/env bash

set -eo pipefail

TAG=$(date '+%Y%m%d')-$(git rev-parse --short HEAD)

# These must be set before calling the script
echo $DOCKERHUB_KITWARE_PASSWORD | docker login --username "$DOCKERHUB_KITWARE_USERNAME" --password-stdin

docker push kitware/itk-wasm-vtk:${TAG}-debug
docker push kitware/itk-wasm-vtk:${TAG}
docker push kitware/itk-wasm-vtk:latest
docker push kitware/itk-wasm-vtk:latest-debug

echo $DOCKERHUB_ITKWASM_PASSWORD | docker login --username "$DOCKERHUB_ITKWASM_USERNAME" --password-stdin

docker push itkwasm/wasi:${TAG}-debug
docker push itkwasm/wasi:${TAG}
docker push itkwasm/wasi:latest
docker push itkwasm/wasi:latest-debug
docker push itkwasm/emscripten-base:latest
docker push itkwasm/emscripten-base:latest-debug

docker push itkwasm/emscripten:${TAG}-debug
docker push itkwasm/emscripten:${TAG}
docker push itkwasm/emscripten:latest
docker push itkwasm/emscripten:latest-debug
docker push itkwasm/wasi-base:latest
docker push itkwasm/wasi-base:latest-debug
