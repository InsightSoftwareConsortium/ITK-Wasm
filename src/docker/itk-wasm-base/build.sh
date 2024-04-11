#!/usr/bin/env bash

set -exo pipefail

script_dir="`cd $(dirname $0); pwd`"
source "$script_dir/../oci_exe.sh"
exe=$(ociExe)

TAG=$(date '+%Y%m%d')-$(git rev-parse --short HEAD)
VCS_REF=$(git rev-parse --short HEAD)
VCS_URL="https://github.com/InsightSoftwareConsortium/itk-wasm"
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

wasi_ld_flags="-flto -lwasi-emulated-process-clocks -lwasi-emulated-signal -lc-printscan-long-double"
wasi_c_flags="-flto -msimd128 -D_WASI_EMULATED_PROCESS_CLOCKS -D_WASI_EMULATED_SIGNAL"

emscripten_debug_ld_flags="-fno-lto -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB"
emscripten_debug_c_flags="-fno-lto -Wno-warn-absolute-paths"

wasi_debug_ld_flags="-fno-lto -lwasi-emulated-process-clocks -lwasi-emulated-signal -lc-printscan-long-double"
wasi_debug_c_flags="-fno-lto -D_WASI_EMULATED_PROCESS_CLOCKS -D_WASI_EMULATED_SIGNAL"

if $create_manifest; then
  for list in itkwasm/emscripten-base:latest \
      itkwasm/emscripten-base:${TAG} \
      itkwasm/emscripten-base:latest-debug \
      itkwasm/emscripten-base:${TAG}-debug \
      itkwasm/wasi-base:latest \
      itkwasm/wasi-base:${TAG} \
      itkwasm/wasi-base:latest-debug \
      itkwasm/wasi-base:${TAG}-debug; do
    if $(buildah manifest exists $list); then
      buildah manifest rm $list
    fi
    buildah manifest create $list
  done
fi

$exe $build_cmd $tag_flag itkwasm/emscripten-base:latest \
        --build-arg IMAGE=itkwasm/emscripten-base \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg VCS_REF=${VCS_REF} \
        --build-arg VCS_URL=${VCS_URL} \
        --build-arg BUILD_DATE=${BUILD_DATE} \
        $script_dir $@
if $version_tag; then
        $exe $build_cmd $tag_flag itkwasm/emscripten-base:${TAG} \
                --build-arg IMAGE=itkwasm/emscripten-base \
                --build-arg CMAKE_BUILD_TYPE=Release \
                --build-arg VERSION=${TAG} \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                $script_dir $@
fi

if $wasi; then
  $exe $build_cmd $tag_flag itkwasm/wasi-base:latest \
          --build-arg IMAGE=itkwasm/wasi-base \
          --build-arg CMAKE_BUILD_TYPE=Release \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          --build-arg BASE_IMAGE=docker.io/dockcross/web-wasi \
          --build-arg LDFLAGS="${wasi_ld_flags}" \
          --build-arg CFLAGS="${wasi_c_flags}" \
          $script_dir $@
        if $version_tag; then
                $exe $build_cmd $tag_flag itkwasm/wasi-base:${TAG} \
                        --build-arg IMAGE=itkwasm/wasi-base \
                        --build-arg CMAKE_BUILD_TYPE=Release \
                        --build-arg VERSION=${TAG} \
                        --build-arg VCS_REF=${VCS_REF} \
                        --build-arg VCS_URL=${VCS_URL} \
                        --build-arg BUILD_DATE=${BUILD_DATE} \
                        --build-arg BASE_IMAGE=docker.io/dockcross/web-wasi \
                        --build-arg LDFLAGS="${wasi_ld_flags}" \
                        --build-arg CFLAGS="${wasi_c_flags}" \
                        $script_dir $@
        fi
fi


if $debug; then
  $exe $build_cmd $tag_flag itkwasm/emscripten-base:latest-debug \
          --build-arg IMAGE=itkwasm/emscripten-base \
          --build-arg CMAKE_BUILD_TYPE=Debug \
          --build-arg USE_DCMTK=OFF \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          --build-arg LDFLAGS="${emscripten_debug_ld_flags}" \
          --build-arg CFLAGS="${emscripten_debug_c_flags}" \
          $script_dir $@
  if $version_tag; then
        $exe $build_cmd $tag_flag itkwasm/emscripten-base:${TAG}-debug \
                --build-arg IMAGE=itkwasm/emscripten-base \
                --build-arg CMAKE_BUILD_TYPE=Debug \
                --build-arg USE_DCMTK=OFF \
                --build-arg VERSION=${TAG}-debug \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                --build-arg LDFLAGS="${emscripten_debug_ld_flags}" \
                --build-arg CFLAGS="${emscripten_debug_c_flags}" \
                $script_dir $@
  fi
  if $wasi; then
    $exe $build_cmd $tag_flag itkwasm/wasi-base:latest-debug \
            --build-arg IMAGE=itkwasm/wasi-base \
            --build-arg CMAKE_BUILD_TYPE=Debug \
            --build-arg VCS_REF=${VCS_REF} \
            --build-arg VCS_URL=${VCS_URL} \
            --build-arg BUILD_DATE=${BUILD_DATE} \
            --build-arg BASE_IMAGE=docker.io/dockcross/web-wasi \
            --build-arg LDFLAGS="${wasi_debug_ld_flags}" \
            --build-arg CFLAGS="${wasi_debug_c_flags}" \
            $script_dir $@
    if $version_tag; then
        $exe $build_cmd $tag_flag itkwasm/wasi-base:${TAG}-debug \
                --build-arg IMAGE=itkwasm/wasi-base \
                --build-arg CMAKE_BUILD_TYPE=Debug \
                --build-arg VERSION=${TAG} \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                --build-arg BASE_IMAGE=docker.io/dockcross/web-wasi \
                --build-arg LDFLAGS="${wasi_debug_ld_flags}" \
                --build-arg CFLAGS="${wasi_debug_c_flags}" \
                $script_dir $@
    fi
  fi
fi
