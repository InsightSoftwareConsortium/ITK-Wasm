#!/usr/bin/env bash

set -exo pipefail

script_dir="`cd $(dirname $0); pwd`"
source "$script_dir/../oci_exe.sh"
exe=$(ociExe)

cd $script_dir

mkdir -p ITKWebAssemblyInterfaceModuleCopy/src
cp_exe=$(which rsync 2>/dev/null || which cp)
$cp_exe -a ../../../{include,CMakeLists.txt,itk-module.cmake} ./ITKWebAssemblyInterfaceModuleCopy/
$cp_exe -a ../../../src/{*.cxx,CMakeLists.txt} ./ITKWebAssemblyInterfaceModuleCopy/src/
$cp_exe -a ../../../src/emscripten-module ./ITKWebAssemblyInterfaceModuleCopy/src/
mkdir -p median-filter-pipelineCopy
$cp_exe -a ../../../packages/core/typescript/itk-wasm/test/pipelines/median-filter-pipeline/{CMakeLists.txt,median-filter-test.cxx} ./median-filter-pipelineCopy

TAG=$(date '+%Y%m%d')-$(git rev-parse --short HEAD)
VCS_REF=$(git rev-parse --short HEAD)
VCS_URL="https://github.com/InsightSoftwareConsortium/ITK-Wasm"
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

debug=false
wasi=false
version_tag=false
build_cmd="build"
tag_flag="--tag"
create_manifest=false
for param; do
  if [[ $param == '--with-debug' ]]; then
    debug=true
  elif [[ $param == '--with-wasi' ]]; then
    wasi=true
  elif [[ $param == '--multiarch' ]]; then
    # Newer buildah (1.28.2) required for multiarch
    exe=buildah
    build_cmd="build --platform linux/amd64,linux/arm64"
    tag_flag="--manifest"
    create_manifest=true
  elif [[ $param == '--version-tag' ]]; then
    version_tag=true
  else
    newparams+=("$param")
  fi
done
set -- "${newparams[@]}"  # overwrites the original positional params

if $create_manifest; then
  for list in quay.io/itk-wasm/emscripten:latest \
      quay.io/itk-wasm/emscripten:${TAG} \
      quay.io/itk-wasm/emscripten:latest-debug \
      quay.io/itk-wasm/emscripten:${TAG}-debug \
      quay.io/itk-wasm/wasi:latest \
      quay.io/itk-wasm/wasi:${TAG} \
      quay.io/itk-wasm/wasi:latest-debug \
      quay.io/itk-wasm/wasi:${TAG}-debug; do
    if $(buildah manifest exists $list); then
      buildah manifest rm $list
    fi
    buildah manifest create $list
  done
fi

$exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/emscripten:latest \
        --build-arg IMAGE=quay.io/itkwasm/emscripten \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg BASE_IMAGE=quay.io/itkwasm/emscripten-base \
        --build-arg VCS_REF=${VCS_REF} \
        --build-arg VCS_URL=${VCS_URL} \
        --build-arg BUILD_DATE=${BUILD_DATE} \
        $script_dir $@
if $version_tag; then
        $exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/emscripten:${TAG} \
                --build-arg IMAGE=quay.io/itkwasm/emscripten \
                --build-arg CMAKE_BUILD_TYPE=Release \
                --build-arg BASE_IMAGE=quay.io/itkwasm/emscripten-base \
                --build-arg BASE_TAG=${TAG} \
                --build-arg VERSION=${TAG} \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                $script_dir $@
fi

if $wasi; then
  $exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/wasi:latest  \
          --build-arg IMAGE=quay.io/itkwasm/wasi \
          --build-arg CMAKE_BUILD_TYPE=Release \
          --build-arg BASE_IMAGE=quay.io/itkwasm/wasi-base \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          $script_dir $@
  if $version_tag; then
        $exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/wasi:${TAG} \
                --build-arg IMAGE=quay.io/itkwasm/wasi \
                --build-arg CMAKE_BUILD_TYPE=Release \
                --build-arg VERSION=${TAG} \
                --build-arg BASE_TAG=${TAG} \
                --build-arg BASE_IMAGE=quay.io/itkwasm/wasi-base \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                $script_dir $@
  fi
fi

if $debug; then
  $exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/emscripten:latest-debug \
          --build-arg IMAGE=quay.io/itkwasm/emscripten \
          --build-arg CMAKE_BUILD_TYPE=Debug \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          $script_dir $@
  if $version_tag; then
        $exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/emscripten:${TAG}-debug \
                --build-arg IMAGE=quay.io/itkwasm/emscripten \
                --build-arg CMAKE_BUILD_TYPE=Debug \
                --build-arg VERSION=${TAG}-debug \
                --build-arg BASE_TAG=${TAG}-debug \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                $script_dir $@
  fi
  if $wasi; then
    $exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/wasi:latest-debug  \
            --build-arg IMAGE=quay.io/itkwasm/wasi \
            --build-arg CMAKE_BUILD_TYPE=Debug \
            --build-arg BASE_IMAGE=quay.io/itkwasm/wasi-base \
            --build-arg VCS_REF=${VCS_REF} \
            --build-arg VCS_URL=${VCS_URL} \
            --build-arg BUILD_DATE=${BUILD_DATE} \
            $script_dir $@
    if $version_tag; then
        $exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/wasi:${TAG}-debug \
                --build-arg IMAGE=quay.io/itkwasm/wasi \
                --build-arg CMAKE_BUILD_TYPE=Debug \
                --build-arg VERSION=${TAG} \
                --build-arg BASE_TAG=${TAG}-debug \
                --build-arg BASE_IMAGE=quay.io/itkwasm/wasi-base \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                $script_dir $@
    fi
  fi
fi


rm -rf ITKWebAssemblyInterfaceModuleCopy median-filter-pipelineCopy
