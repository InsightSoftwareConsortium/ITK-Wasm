#!/usr/bin/env bash

set -eo pipefail

script_dir="`cd $(dirname $0); pwd`"

cd $script_dir

mkdir -p ITKWebAssemblyInterfaceModuleCopy
rsync -a ../../../{include,CMakeLists.txt,itk-module.cmake} ./ITKWebAssemblyInterfaceModuleCopy/
rsync -a ../../../src/{*.cxx,CMakeLists.txt} ./ITKWebAssemblyInterfaceModuleCopy/src/
rsync -a ../../../src/emscripten-module ./ITKWebAssemblyInterfaceModuleCopy/src/
mkdir -p MedianFilterPipelineCopy
rsync -a ../../../test/pipelines/MedianFilterPipeline/{CMakeLists.txt,MedianFilterTest.cxx} ./MedianFilterPipelineCopy

TAG=$(date '+%Y%m%d')-$(git rev-parse --short HEAD)
VCS_REF=$(git rev-parse --short HEAD)
VCS_URL="https://github.com/InsightSoftwareConsortium/itk-wasm"
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

debug=false
wasi=false
for param; do
  if [[ $param == '--with-debug' ]]; then
    debug=true
  elif [[ $param == '--with-wasi' ]]; then
    wasi=true
  else
    newparams+=("$param")
  fi
done
set -- "${newparams[@]}"  # overwrites the original positional params

docker build -t insighttoolkit/itk-wasm:latest \
        --build-arg IMAGE=insighttoolkit/itk-wasm \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg VCS_REF=${VCS_REF} \
        --build-arg VCS_URL=${VCS_URL} \
        --build-arg BUILD_DATE=${BUILD_DATE} \
        $script_dir $@
docker build -t insighttoolkit/itk-wasm:${TAG} \
        --build-arg IMAGE=insighttoolkit/itk-wasm \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg VERSION=${TAG} \
        --build-arg VCS_REF=${VCS_REF} \
        --build-arg VCS_URL=${VCS_URL} \
        --build-arg BUILD_DATE=${BUILD_DATE} \
        $script_dir $@

if $wasi; then
  docker build -t insighttoolkit/itk-wasi:latest  \
          --build-arg IMAGE=insighttoolkit/itk-wasi \
          --build-arg CMAKE_BUILD_TYPE=Release \
          --build-arg BASE_IMAGE=insighttoolkit/itk-wasi-base \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          $script_dir $@
  docker build -t insighttoolkit/itk-wasi:${TAG} \
          --build-arg IMAGE=insighttoolkit/itk-wasi \
          --build-arg CMAKE_BUILD_TYPE=Release \
          --build-arg VERSION=${TAG} \
          --build-arg BASE_TAG=${TAG} \
          --build-arg BASE_IMAGE=insighttoolkit/itk-wasi-base \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          $script_dir $@
fi

if $debug; then
  docker build -t insighttoolkit/itk-wasm:latest-debug \
          --build-arg IMAGE=insighttoolkit/itk-wasm \
          --build-arg CMAKE_BUILD_TYPE=Debug \
          --build-arg BASE_TAG=${TAG}-debug \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          $script_dir $@
  docker build -t insighttoolkit/itk-wasm:${TAG}-debug \
          --build-arg IMAGE=insighttoolkit/itk-wasm \
          --build-arg CMAKE_BUILD_TYPE=Debug \
          --build-arg VERSION=${TAG}-debug \
          --build-arg BASE_TAG=${TAG}-debug \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          $script_dir $@
  if $wasi; then
    docker build -t insighttoolkit/itk-wasi:latest-debug  \
            --build-arg IMAGE=insighttoolkit/itk-wasi \
            --build-arg CMAKE_BUILD_TYPE=Debug \
            --build-arg BASE_IMAGE=insighttoolkit/itk-wasi-base \
            --build-arg BASE_TAG=${TAG}-debug \
            --build-arg VCS_REF=${VCS_REF} \
            --build-arg VCS_URL=${VCS_URL} \
            --build-arg BUILD_DATE=${BUILD_DATE} \
            $script_dir $@
    docker build -t insighttoolkit/itk-wasi:${TAG}-debug \
            --build-arg IMAGE=insighttoolkit/itk-wasi \
            --build-arg CMAKE_BUILD_TYPE=Debug \
            --build-arg VERSION=${TAG} \
            --build-arg BASE_TAG=${TAG}-debug \
            --build-arg BASE_IMAGE=insighttoolkit/itk-wasi-base \
            --build-arg VCS_REF=${VCS_REF} \
            --build-arg VCS_URL=${VCS_URL} \
            --build-arg BUILD_DATE=${BUILD_DATE} \
            $script_dir $@
  fi
fi


rm -rf ITKWebAssemblyInterfaceModuleCopy MedianFilterPipelineCopy
