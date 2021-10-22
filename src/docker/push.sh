#!/usr/bin/env bash

set -eo pipefail

TAG=$(date '+%Y%m%d')-$(git rev-parse --short HEAD)

# These must be set before calling the script
#echo $DOCKERHUB_KITWARE_PASSWORD | docker login --username "$DOCKERHUB_KITWARE_USERNAME" --password-stdin

#docker push kitware/itk-wasm-vtk:${TAG}-debug
#docker push kitware/itk-wasm-vtk:${TAG}
#docker push kitware/itk-wasm-vtk:latest

echo $DOCKERHUB_INSIGHTTOOLKIT_PASSWORD | docker login --username "$DOCKERHUB_INSIGHTTOOLKIT_USERNAME" --password-stdin

docker push insighttoolkit/itk-wasi:${TAG}-debug
docker push insighttoolkit/itk-wasi:${TAG}
docker push insighttoolkit/itk-wasi:latest

docker push insighttoolkit/itk-wasm:${TAG}-debug
docker push insighttoolkit/itk-wasm:${TAG}
docker push insighttoolkit/itk-wasm:latest
