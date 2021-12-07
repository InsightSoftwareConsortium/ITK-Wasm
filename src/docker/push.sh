#!/usr/bin/env bash

set -eo pipefail

TAG=$(date '+%Y%m%d')-$(git rev-parse --short HEAD)

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

docker push itkwasm/emscripten-vtk:${TAG}-debug
docker push itkwasm/emscripten-vtk:${TAG}
docker push itkwasm/emscripten-vtk:latest
docker push itkwasm/emscripten-vtk:latest-debug