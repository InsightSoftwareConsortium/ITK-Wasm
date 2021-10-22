#!/usr/bin/env bash

set -eo pipefail

script_dir="`cd $(dirname $0); pwd`"

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

docker build -t insighttoolkit/itk-wasm-base:latest \
        --build-arg IMAGE=insighttoolkit/itk-wasm-base \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg VCS_REF=${VCS_REF} \
        --build-arg VCS_URL=${VCS_URL} \
        --build-arg BUILD_DATE=${BUILD_DATE} \
        $script_dir $@
docker build -t insighttoolkit/itk-wasm-base:${TAG} \
        --build-arg IMAGE=insighttoolkit/itk-wasm-base \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg VERSION=${TAG} \
        --build-arg VCS_REF=${VCS_REF} \
        --build-arg VCS_URL=${VCS_URL} \
        --build-arg BUILD_DATE=${BUILD_DATE} \
        $script_dir $@

if $wasi; then
  docker build -t insighttoolkit/itk-wasi-base:latest \
          --build-arg IMAGE=insighttoolkit/itk-wasi-base \
          --build-arg CMAKE_BUILD_TYPE=Release \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          --build-arg BASE_IMAGE=dockcross/web-wasi \
          --build-arg LDFLAGS="-lwasi-emulated-signal" \
          --build-arg CFLAGS="-D_WASI_EMULATED_SIGNAL" \
          $script_dir $@
  docker build -t insighttoolkit/itk-wasi-base:${TAG} \
          --build-arg IMAGE=insighttoolkit/itk-wasi-base \
          --build-arg CMAKE_BUILD_TYPE=Release \
          --build-arg VERSION=${TAG} \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          --build-arg BASE_IMAGE=dockcross/web-wasi \
          --build-arg LDFLAGS="-lwasi-emulated-signal" \
          --build-arg CFLAGS="-D_WASI_EMULATED_SIGNAL" \
          $script_dir $@
fi


if $debug; then
  docker build -t insighttoolkit/itk-wasm-base:latest-debug \
          --build-arg IMAGE=insighttoolkit/itk-wasm-base \
          --build-arg CMAKE_BUILD_TYPE=Debug \
          --build-arg USE_DCMTK=OFF \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          $script_dir $@
  docker build -t insighttoolkit/itk-wasm-base:${TAG}-debug \
          --build-arg IMAGE=insighttoolkit/itk-wasm-base \
          --build-arg CMAKE_BUILD_TYPE=Debug \
          --build-arg USE_DCMTK=OFF \
          --build-arg VERSION=${TAG}-debug \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          $script_dir $@
  if $wasi; then
    docker build -t insighttoolkit/itk-wasi-base:latest-debug \
            --build-arg IMAGE=insighttoolkit/itk-wasi-base \
            --build-arg CMAKE_BUILD_TYPE=Debug \
            --build-arg VCS_REF=${VCS_REF} \
            --build-arg VCS_URL=${VCS_URL} \
            --build-arg BUILD_DATE=${BUILD_DATE} \
            --build-arg BASE_IMAGE=dockcross/web-wasi \
            --build-arg LDFLAGS="-lwasi-emulated-signal" \
            --build-arg CFLAGS="-D_WASI_EMULATED_SIGNAL" \
            $script_dir $@
    docker build -t insighttoolkit/itk-wasi-base:${TAG}-debug \
            --build-arg IMAGE=insighttoolkit/itk-wasi-base \
            --build-arg CMAKE_BUILD_TYPE=Debug \
            --build-arg VERSION=${TAG} \
            --build-arg VCS_REF=${VCS_REF} \
            --build-arg VCS_URL=${VCS_URL} \
            --build-arg BUILD_DATE=${BUILD_DATE} \
            --build-arg BASE_IMAGE=dockcross/web-wasi \
            --build-arg LDFLAGS="-lwasi-emulated-signal" \
            --build-arg CFLAGS="-D_WASI_EMULATED_SIGNAL" \
            $script_dir $@
  fi
fi
