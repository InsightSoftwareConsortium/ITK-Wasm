#!/usr/bin/env bash

set -exo pipefail

script_dir="`cd $(dirname $0); pwd`"
source "$script_dir/../oci_exe.sh"
exe=$(ociExe)

TAG=$(date '+%Y%m%d')-$(git rev-parse --short HEAD)
VCS_REF=$(git rev-parse --short HEAD)
VCS_URL="https://github.com/InsightSoftwareConsortium/ITK-Wasm"
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

debug=false
wasi=false
version_tag=false
local_itk=""
build_cmd="build"
tag_flag="--tag"
host_arch=$(uname -m | sed -e 's/x86_64/amd64/' -e 's/aarch64/arm64/')
while [[ $# -gt 0 ]]; do
  case $1 in
    --with-debug)
      debug=true
      shift
      ;;
    --with-wasi)
      wasi=true
      shift
      ;;
    --version-tag)
      version_tag=true
      shift
      ;;
    --local-itk)
      local_itk="$2"
      shift 2
      ;;
    *)
      newparams+=("$1")
      shift
      ;;
  esac
done
set -- "${newparams[@]}"  # overwrites the original positional params

# Support ITK_WASM_LOCAL_ITK_SOURCE environment variable as fallback
if [[ -z "$local_itk" && -n "${ITK_WASM_LOCAL_ITK_SOURCE:-}" ]]; then
  local_itk="$ITK_WASM_LOCAL_ITK_SOURCE"
fi

# Note: also need to set in wasi-sdk-pthread-itkwasm.cmake
wasi_ld_flags="-flto -lwasi-emulated-process-clocks -lwasi-emulated-signal -lc-printscan-long-double"
wasi_c_flags="-flto -msimd128 -D_WASI_EMULATED_PROCESS_CLOCKS -D_WASI_EMULATED_SIGNAL"

emscripten_debug_ld_flags="-fno-lto -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB"
emscripten_debug_c_flags="-msimd128 -fno-lto -Wno-warn-absolute-paths"

wasi_debug_ld_flags="-fno-lto -lwasi-emulated-process-clocks -lwasi-emulated-signal -lc-printscan-long-double"
wasi_debug_c_flags="-fno-lto -D_WASI_EMULATED_PROCESS_CLOCKS -D_WASI_EMULATED_SIGNAL"

emscripten_threads_ld_flags="-pthread -s PTHREAD_POOL_SIZE=navigator.hardwareConcurrency -s MALLOC=mimalloc -flto -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB"
emscripten_threads_c_flags="-pthread -msimd128 -flto -Wno-warn-absolute-paths -DITK_WASM_NO_FILESYSTEM_IO"

emscripten_threads_debug_ld_flags="-pthread -s MALLOC=mimalloc -s PTHREAD_POOL_SIZE=navigator.hardwareConcurrency -fno-lto -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB"
emscripten_threads_debug_c_flags="-pthread -msimd128 -fno-lto -Wno-warn-absolute-paths"

# Handle local ITK source
local_itk_build_arg=""
if [[ -n "$local_itk" ]]; then
  if [[ ! -d "$local_itk" ]]; then
    echo "Error: Local ITK directory does not exist: $local_itk"
    exit 1
  fi
  echo "Using local ITK source from: $local_itk"
  # Clear placeholder and copy local ITK source
  rm -rf "$script_dir/ITKLocalCopy"/*
  cp_exe=$(which rsync 2>/dev/null || which cp)
  $cp_exe -a "$local_itk"/* "$script_dir/ITKLocalCopy/"
  local_itk_build_arg="--build-arg USE_LOCAL_ITK=1"
fi

# Generate environment variables file for Docker
"$script_dir/generate-env-vars.sh"

# Cleanup function to restore ITKLocalCopy to placeholder state and remove generated files
cleanup_build_artifacts() {
  if [[ -n "$local_itk" ]]; then
    rm -rf "$script_dir/ITKLocalCopy"/*
    touch "$script_dir/ITKLocalCopy/.gitkeep"
  fi
  # Remove generated env vars file
  rm -f "$script_dir/itk_wasm_env_vars.sh"
}
trap cleanup_build_artifacts EXIT

$exe $build_cmd $tag_flag quay.io/itkwasm/emscripten-base:latest-$host_arch \
        --build-arg IMAGE=quay.io/itkwasm/emscripten-base \
        --build-arg HOST_ARCH=$host_arch \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg VCS_REF=${VCS_REF} \
        --build-arg VCS_URL=${VCS_URL} \
        --build-arg BUILD_DATE=${BUILD_DATE} \
        $local_itk_build_arg \
        $script_dir $@
if $version_tag; then
        $exe $build_cmd $tag_flag quay.io/itkwasm/emscripten-base:${TAG}-$host_arch \
                --build-arg IMAGE=quay.io/itkwasm/emscripten-base \
                --build-arg HOST_ARCH=$host_arch \
                --build-arg CMAKE_BUILD_TYPE=Release \
                --build-arg VERSION=${TAG} \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                $local_itk_build_arg \
                $script_dir $@
fi

$exe $build_cmd $tag_flag quay.io/itkwasm/emscripten-base:latest-threads-$host_arch \
        --build-arg IMAGE=quay.io/itkwasm/emscripten-base \
        --build-arg HOST_ARCH=$host_arch \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg VERSION=latest-threads \
        --build-arg VCS_REF=${VCS_REF} \
        --build-arg VCS_URL=${VCS_URL} \
        --build-arg BUILD_DATE=${BUILD_DATE} \
        --build-arg LDFLAGS="${emscripten_threads_ld_flags}" \
        --build-arg CFLAGS="${emscripten_threads_c_flags}" \
        $local_itk_build_arg \
        $script_dir $@
if $version_tag; then
        $exe $build_cmd $tag_flag quay.io/itkwasm/emscripten-base:${TAG}-threads-$host_arch \
                --build-arg IMAGE=quay.io/itkwasm/emscripten-base \
                --build-arg HOST_ARCH=$host_arch \
                --build-arg CMAKE_BUILD_TYPE=Release \
                --build-arg VERSION=${TAG}-threads \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                --build-arg LDFLAGS="${emscripten_threads_ld_flags}" \
                --build-arg CFLAGS="${emscripten_threads_c_flags}" \
                $local_itk_build_arg \
                $script_dir $@
fi

if $wasi; then
  $exe $build_cmd $tag_flag quay.io/itkwasm/wasi-base:latest-$host_arch \
          --build-arg IMAGE=quay.io/itkwasm/wasi-base \
          --build-arg HOST_ARCH=$host_arch \
          --build-arg CMAKE_BUILD_TYPE=Release \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          --build-arg BASE_IMAGE=docker.io/dockcross/web-wasi-emulated-threads \
          --build-arg LDFLAGS="${wasi_ld_flags}" \
          --build-arg CFLAGS="${wasi_c_flags}" \
          $local_itk_build_arg \
          $script_dir $@
        if $version_tag; then
                $exe $build_cmd $tag_flag quay.io/itkwasm/wasi-base:${TAG}-$host_arch \
                        --build-arg IMAGE=itkwasm/wasi-base \
                        --build-arg HOST_ARCH=$host_arch \
                        --build-arg CMAKE_BUILD_TYPE=Release \
                        --build-arg VERSION=${TAG} \
                        --build-arg VCS_REF=${VCS_REF} \
                        --build-arg VCS_URL=${VCS_URL} \
                        --build-arg BUILD_DATE=${BUILD_DATE} \
                        --build-arg BASE_IMAGE=docker.io/dockcross/web-wasi-emulated-threads \
                        --build-arg LDFLAGS="${wasi_ld_flags}" \
                        --build-arg CFLAGS="${wasi_c_flags}" \
                        $local_itk_build_arg \
                        $script_dir $@
        fi
fi


if $debug; then
  $exe $build_cmd $tag_flag quay.io/itkwasm/emscripten-base:latest-debug-$host_arch \
          --build-arg IMAGE=quay.io/itkwasm/emscripten-base \
          --build-arg HOST_ARCH=$host_arch \
          --build-arg CMAKE_BUILD_TYPE=Debug \
          --build-arg USE_DCMTK=OFF \
          --build-arg VERSION=latest-debug \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          --build-arg LDFLAGS="${emscripten_debug_ld_flags}" \
          --build-arg CFLAGS="${emscripten_debug_c_flags}" \
          $local_itk_build_arg \
          $script_dir $@
  if $version_tag; then
        $exe $build_cmd $tag_flag quay.io/itkwasm/emscripten-base:${TAG}-debug-$host_arch \
                --build-arg IMAGE=quay.io/itkwasm/emscripten-base \
                --build-arg HOST_ARCH=$host_arch \
                --build-arg CMAKE_BUILD_TYPE=Debug \
                --build-arg USE_DCMTK=OFF \
                --build-arg VERSION=${TAG}-debug \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                --build-arg LDFLAGS="${emscripten_debug_ld_flags}" \
                --build-arg CFLAGS="${emscripten_debug_c_flags}" \
                $local_itk_build_arg \
                $script_dir $@
  fi
  $exe $build_cmd $tag_flag quay.io/itkwasm/emscripten-base:latest-threads-debug-$host_arch \
          --build-arg IMAGE=quay.io/itkwasm/emscripten-base \
          --build-arg HOST_ARCH=$host_arch \
          --build-arg CMAKE_BUILD_TYPE=Debug \
          --build-arg USE_DCMTK=OFF \
          --build-arg VERSION=${TAG}-threads-debug \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          --build-arg LDFLAGS="${emscripten_threads_debug_ld_flags}" \
          --build-arg CFLAGS="${emscripten_threads_debug_c_flags}" \
          $local_itk_build_arg \
          $script_dir $@
  if $version_tag; then
        $exe $build_cmd $tag_flag quay.io/itkwasm/emscripten-base:${TAG}-threads-debug-$host_arch \
                --build-arg IMAGE=quay.io/itkwasm/emscripten-base \
                --build-arg HOST_ARCH=$host_arch \
                --build-arg CMAKE_BUILD_TYPE=Debug \
                --build-arg USE_DCMTK=OFF \
                --build-arg VERSION=${TAG}-debug \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                --build-arg LDFLAGS="${emscripten_threads_debug_ld_flags}" \
                --build-arg CFLAGS="${emscripten_threads_debug_c_flags}" \
                $local_itk_build_arg \
                $script_dir $@
  fi
  if $wasi; then
    $exe $build_cmd $tag_flag quay.io/itkwasm/wasi-base:latest-debug-$host_arch \
            --build-arg IMAGE=quay.io/itkwasm/wasi-base \
            --build-arg HOST_ARCH=$host_arch \
            --build-arg CMAKE_BUILD_TYPE=Debug \
            --build-arg VCS_REF=${VCS_REF} \
            --build-arg VCS_URL=${VCS_URL} \
            --build-arg BUILD_DATE=${BUILD_DATE} \
            --build-arg BASE_IMAGE=docker.io/dockcross/web-wasi-emulated-threads \
            --build-arg LDFLAGS="${wasi_debug_ld_flags}" \
            --build-arg CFLAGS="${wasi_debug_c_flags}" \
            $local_itk_build_arg \
            $script_dir $@
    if $version_tag; then
        $exe $build_cmd $tag_flag quay.io/itkwasm/wasi-base:${TAG}-debug-$host_arch \
                --build-arg IMAGE=quay.io/itkwasm/wasi-base \
                --build-arg HOST_ARCH=$host_arch \
                --build-arg CMAKE_BUILD_TYPE=Debug \
                --build-arg VERSION=${TAG} \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                --build-arg BASE_IMAGE=docker.io/dockcross/web-wasi-emulated-threads \
                --build-arg LDFLAGS="${wasi_debug_ld_flags}" \
                --build-arg CFLAGS="${wasi_debug_c_flags}" \
                $local_itk_build_arg \
                $script_dir $@
    fi
  fi
fi
