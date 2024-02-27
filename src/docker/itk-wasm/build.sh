#!/usr/bin/env bash

set -exo pipefail

script_dir="`cd $(dirname $0); pwd`"
source "$script_dir/../oci_exe.sh"
exe=$(ociExe)

cd $script_dir

mkdir -p ITKWebAssemblyInterfaceModuleCopy
cp_exe=$(which rsync 2>/dev/null || which cp)
$cp_exe -a ../../../{include,CMakeLists.txt,itk-module.cmake} ./ITKWebAssemblyInterfaceModuleCopy/
$cp_exe -a ../../../src/{*.cxx,CMakeLists.txt} ./ITKWebAssemblyInterfaceModuleCopy/src/
$cp_exe -a ../../../src/emscripten-module ./ITKWebAssemblyInterfaceModuleCopy/src/
mkdir -p median-filter-pipelineCopy
$cp_exe -a ../../../packages/core/typescript/itk-wasm/test/pipelines/median-filter-pipeline/{CMakeLists.txt,median-filter-test.cxx} ./median-filter-pipelineCopy

TAG=$(date '+%Y%m%d')-$(git rev-parse --short HEAD)
VCS_REF=$(git rev-parse --short HEAD)
VCS_URL="https://github.com/InsightSoftwareConsortium/itk-wasm"
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

debug=false
wasi=false
version_tag=false
for param; do
  if [[ $param == '--with-debug' ]]; then
    debug=true
  elif [[ $param == '--with-wasi' ]]; then
    wasi=true
  elif [[ $param == '--version-tag' ]]; then
    version_tag=true
  else
    newparams+=("$param")
  fi
done
set -- "${newparams[@]}"  # overwrites the original positional params

$exe build -t itkwasm/emscripten:latest \
        --build-arg IMAGE=itkwasm/emscripten \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg VCS_REF=${VCS_REF} \
        --build-arg VCS_URL=${VCS_URL} \
        --build-arg BUILD_DATE=${BUILD_DATE} \
        $script_dir $@
if $version_tag; then
        $exe build -t itkwasm/emscripten:${TAG} \
                --build-arg IMAGE=itkwasm/emscripten \
                --build-arg CMAKE_BUILD_TYPE=Release \
                --build-arg VERSION=${TAG} \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                $script_dir $@
fi

if $wasi; then
  $exe build -t itkwasm/wasi:latest  \
          --build-arg IMAGE=itkwasm/wasi \
          --build-arg CMAKE_BUILD_TYPE=Release \
          --build-arg BASE_IMAGE=itkwasm/wasi-base \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          $script_dir $@
  if $version_tag; then
        $exe build -t itkwasm/wasi:${TAG} \
                --build-arg IMAGE=itkwasm/wasi \
                --build-arg CMAKE_BUILD_TYPE=Release \
                --build-arg VERSION=${TAG} \
                --build-arg BASE_TAG=${TAG} \
                --build-arg BASE_IMAGE=itkwasm/wasi-base \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                $script_dir $@
  fi
fi

if $debug; then
  $exe build -t itkwasm/emscripten:latest-debug \
          --build-arg IMAGE=itkwasm/emscripten \
          --build-arg CMAKE_BUILD_TYPE=Debug \
          --build-arg BASE_TAG=${TAG}-debug \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          $script_dir $@
  if $version_tag; then
        $exe build -t itkwasm/emscripten:${TAG}-debug \
                --build-arg IMAGE=itkwasm/emscripten \
                --build-arg CMAKE_BUILD_TYPE=Debug \
                --build-arg VERSION=${TAG}-debug \
                --build-arg BASE_TAG=${TAG}-debug \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                $script_dir $@
  fi
  if $wasi; then
    $exe build -t itkwasm/wasi:latest-debug  \
            --build-arg IMAGE=itkwasm/wasi \
            --build-arg CMAKE_BUILD_TYPE=Debug \
            --build-arg BASE_IMAGE=itkwasm/wasi-base \
            --build-arg BASE_TAG=${TAG}-debug \
            --build-arg VCS_REF=${VCS_REF} \
            --build-arg VCS_URL=${VCS_URL} \
            --build-arg BUILD_DATE=${BUILD_DATE} \
            $script_dir $@
    if $version_tag; then
        $exe build -t itkwasm/wasi:${TAG}-debug \
                --build-arg IMAGE=itkwasm/wasi \
                --build-arg CMAKE_BUILD_TYPE=Debug \
                --build-arg VERSION=${TAG} \
                --build-arg BASE_TAG=${TAG}-debug \
                --build-arg BASE_IMAGE=itkwasm/wasi-base \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                $script_dir $@
    fi
  fi
fi


rm -rf ITKWebAssemblyInterfaceModuleCopy median-filter-pipelineCopy
