#!/usr/bin/env bash

set -eo pipefail

script_dir="`cd $(dirname $0); pwd`"

TAG=$(date '+%Y%m%d')-$(git rev-parse --short HEAD)
VCS_REF=$(git rev-parse --short HEAD)
VCS_URL="https://github.com/InsightSoftwareConsortium/itk-js"
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

debug=false
for param; do
  if [[ $param == '--with-debug' ]]; then
    debug=true
  else
    newparams+=("$param")
  fi
done
set -- "${newparams[@]}"  # overwrites the original positional params

docker build -t kitware/itk-js-vtk:latest \
        --build-arg IMAGE=kitware/itk-js-vtk \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg VCS_REF=${VCS_REF} \
        --build-arg VCS_URL=${VCS_URL} \
        --build-arg BUILD_DATE=${BUILD_DATE} \
        $script_dir $@
docker build -t kitware/itk-js-vtk:${TAG} \
        --build-arg IMAGE=kitware/itk-js-vtk \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg VERSION=${TAG} \
        --build-arg BASE_TAG=${TAG} \
        --build-arg VCS_REF=${VCS_REF} \
        --build-arg VCS_URL=${VCS_URL} \
        --build-arg BUILD_DATE=${BUILD_DATE} \
        $script_dir $@

if $debug; then
  docker build -t kitware/itk-js-vtk:latest-debug \
          --build-arg IMAGE=kitware/itk-js-vtk \
          --build-arg CMAKE_BUILD_TYPE=Debug \
          --build-arg BASE_TAG=latest-debug \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          $script_dir $@
  docker build -t kitware/itk-js-vtk:${TAG}-debug \
          --build-arg IMAGE=kitware/itk-js-vtk \
          --build-arg CMAKE_BUILD_TYPE=Debug \
          --build-arg VERSION=${TAG}-debug \
          --build-arg BASE_TAG=${TAG}-debug \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          $script_dir $@
fi
