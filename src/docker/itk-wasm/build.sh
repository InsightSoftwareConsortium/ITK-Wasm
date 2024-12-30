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
host_arch=$(uname -m | sed -e 's/x86_64/amd64/' -e 's/aarch64/arm64/')
create_manifest=false
for param; do
  if [[ $param == '--with-debug' ]]; then
    debug=true
  elif [[ $param == '--with-wasi' ]]; then
    wasi=true
  elif [[ $param == '--multiarch' ]]; then
    create_manifest=true
  elif [[ $param == '--version-tag' ]]; then
    version_tag=true
  else
    newparams+=("$param")
  fi
done
set -- "${newparams[@]}"  # overwrites the original positional params

$exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/emscripten:latest-$host_arch \
        --build-arg IMAGE=quay.io/itkwasm/emscripten \
        --build-arg HOST_ARCH=$host_arch \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg BASE_IMAGE=quay.io/itkwasm/emscripten-base \
        --build-arg VCS_REF=${VCS_REF} \
        --build-arg VCS_URL=${VCS_URL} \
        --build-arg BUILD_DATE=${BUILD_DATE} \
        $script_dir $@
if $version_tag; then
        $exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/emscripten:${TAG}-$host_arch \
                --build-arg IMAGE=quay.io/itkwasm/emscripten \
                --build-arg HOST_ARCH=$host_arch \
                --build-arg CMAKE_BUILD_TYPE=Release \
                --build-arg BASE_IMAGE=quay.io/itkwasm/emscripten-base \
                --build-arg BASE_TAG=${TAG}-$host_arch \
                --build-arg VERSION=${TAG} \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                $script_dir $@
fi

if $wasi; then
  $exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/wasi:latest-$host_arch  \
          --build-arg IMAGE=quay.io/itkwasm/wasi \
          --build-arg HOST_ARCH=$host_arch \
          --build-arg CMAKE_BUILD_TYPE=Release \
          --build-arg BASE_IMAGE=quay.io/itkwasm/wasi-base \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          $script_dir $@
  if $version_tag; then
        $exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/wasi:${TAG}-$host_arch \
                --build-arg IMAGE=quay.io/itkwasm/wasi \
                --build-arg HOST_ARCH=$host_arch \
                --build-arg CMAKE_BUILD_TYPE=Release \
                --build-arg VERSION=${TAG} \
                --build-arg BASE_TAG=${TAG}-$host_arch \
                --build-arg BASE_IMAGE=quay.io/itkwasm/wasi-base \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                $script_dir $@
  fi
fi

if $debug; then
  $exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/emscripten:latest-debug-$host_arch \
          --build-arg IMAGE=quay.io/itkwasm/emscripten \
          --build-arg HOST_ARCH=$host_arch \
          --build-arg CMAKE_BUILD_TYPE=Debug \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          $script_dir $@
  if $version_tag; then
        $exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/emscripten:${TAG}-debug-$host_arch \
                --build-arg IMAGE=quay.io/itkwasm/emscripten \
                --build-arg HOST_ARCH=$host_arch \
                --build-arg CMAKE_BUILD_TYPE=Debug \
                --build-arg VERSION=${TAG}-debug \
                --build-arg BASE_TAG=${TAG}-debug-$host_arch \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                $script_dir $@
  fi
  if $wasi; then
    $exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/wasi:latest-debug-$host_arch  \
            --build-arg IMAGE=quay.io/itkwasm/wasi \
            --build-arg HOST_ARCH=$host_arch \
            --build-arg CMAKE_BUILD_TYPE=Debug \
            --build-arg BASE_IMAGE=quay.io/itkwasm/wasi-base \
            --build-arg VCS_REF=${VCS_REF} \
            --build-arg VCS_URL=${VCS_URL} \
            --build-arg BUILD_DATE=${BUILD_DATE} \
            $script_dir $@
    if $version_tag; then
        $exe $build_cmd --pull=false $tag_flag quay.io/itkwasm/wasi:${TAG}-debug-$host_arch \
                --build-arg IMAGE=quay.io/itkwasm/wasi \
                --build-arg HOST_ARCH=$host_arch \
                --build-arg CMAKE_BUILD_TYPE=Debug \
                --build-arg VERSION=${TAG} \
                --build-arg BASE_TAG=${TAG}-debug-$host_arch \
                --build-arg BASE_IMAGE=quay.io/itkwasm/wasi-base \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                $script_dir $@
    fi
  fi
fi


rm -rf ITKWebAssemblyInterfaceModuleCopy median-filter-pipelineCopy

if $create_manifest; then
  for list in quay.io/itkwasm/emscripten:latest \
      quay.io/itkwasm/emscripten:${TAG} \
      quay.io/itkwasm/emscripten:latest-debug \
      quay.io/itkwasm/emscripten:${TAG}-debug \
      quay.io/itkwasm/wasi:latest \
      quay.io/itkwasm/wasi:${TAG} \
      quay.io/itkwasm/wasi:latest-debug \
      quay.io/itkwasm/wasi:${TAG}-debug; do
    if $(buildah manifest exists $list); then
      buildah manifest rm $list
    fi
    buildah manifest create $list
    buildah manifest add ${list} ${list}-amd64
    buildah pull $list-arm64
    buildah manifest add ${list} docker://${list}-arm64
  done
fi
