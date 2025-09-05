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
build_cmd="build"
tag_flag="--tag"
host_arch=$(uname -m | sed -e 's/x86_64/amd64/' -e 's/aarch64/arm64/')
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

# Note: also need to set in wasi-sdk-pthread-itkwasm.cmake
wasi_ld_flags="-flto -lwasi-emulated-process-clocks -lwasi-emulated-signal -lc-printscan-long-double"
wasi_c_flags="-flto -msimd128 -D_WASI_EMULATED_PROCESS_CLOCKS -D_WASI_EMULATED_SIGNAL"

emscripten_debug_ld_flags="-fno-lto -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB"
emscripten_debug_c_flags="-msimd128 -fno-lto -Wno-warn-absolute-paths"

wasi_debug_ld_flags="-fno-lto -lwasi-emulated-process-clocks -lwasi-emulated-signal -lc-printscan-long-double"
wasi_debug_c_flags="-fno-lto -D_WASI_EMULATED_PROCESS_CLOCKS -D_WASI_EMULATED_SIGNAL"

emscripten_threads_ld_flags="-pthread -s PTHREAD_POOL_SIZE=navigator.hardwareConcurrency -s MALLOC=mimalloc -flto -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB -Wno-pthreads-mem-growth"
emscripten_threads_c_flags="-pthread -msimd128 -flto -Wno-warn-absolute-paths -DITK_WASM_NO_FILESYSTEM_IO"

emscripten_threads_debug_ld_flags="-pthread -s MALLOC=mimalloc -s PTHREAD_POOL_SIZE=navigator.hardwareConcurrency -fno-lto -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB -Wno-pthreads-mem-growth"
emscripten_threads_debug_c_flags="-pthread -msimd128 -fno-lto -Wno-warn-absolute-paths"

$exe $build_cmd $tag_flag docker.io/itkwasm/emscripten-base:latest-$host_arch \
        --build-arg IMAGE=docker.io/itkwasm/emscripten-base \
        --build-arg HOST_ARCH=$host_arch \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg VCS_REF=${VCS_REF} \
        --build-arg VCS_URL=${VCS_URL} \
        --build-arg BUILD_DATE=${BUILD_DATE} \
        $script_dir $@
if $version_tag; then
        $exe $build_cmd $tag_flag docker.io/itkwasm/emscripten-base:${TAG}-$host_arch \
                --build-arg IMAGE=docker.io/itkwasm/emscripten-base \
                --build-arg HOST_ARCH=$host_arch \
                --build-arg CMAKE_BUILD_TYPE=Release \
                --build-arg VERSION=${TAG} \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                $script_dir $@
fi

$exe $build_cmd $tag_flag docker.io/itkwasm/emscripten-base:latest-threads-$host_arch \
        --build-arg IMAGE=docker.io/itkwasm/emscripten-base \
        --build-arg HOST_ARCH=$host_arch \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg VERSION=latest-threads \
        --build-arg VCS_REF=${VCS_REF} \
        --build-arg VCS_URL=${VCS_URL} \
        --build-arg BUILD_DATE=${BUILD_DATE} \
        --build-arg LDFLAGS="${emscripten_threads_ld_flags}" \
        --build-arg CFLAGS="${emscripten_threads_c_flags}" \
        --build-arg ITK_USE_EMSCRIPTEN_THREADS=1 \
        $script_dir $@
if $version_tag; then
        $exe $build_cmd $tag_flag docker.io/itkwasm/emscripten-base:${TAG}-threads-$host_arch \
                --build-arg IMAGE=docker.io/itkwasm/emscripten-base \
                --build-arg HOST_ARCH=$host_arch \
                --build-arg CMAKE_BUILD_TYPE=Release \
                --build-arg VERSION=${TAG}-threads \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                --build-arg LDFLAGS="${emscripten_threads_ld_flags}" \
                --build-arg CFLAGS="${emscripten_threads_c_flags}" \
                --build-arg ITK_USE_EMSCRIPTEN_THREADS=1 \
                $script_dir $@
fi

if $wasi; then
  $exe $build_cmd $tag_flag docker.io/itkwasm/wasi-base:latest-$host_arch \
          --build-arg IMAGE=docker.io/itkwasm/wasi-base \
          --build-arg HOST_ARCH=$host_arch \
          --build-arg CMAKE_BUILD_TYPE=Release \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          --build-arg BASE_IMAGE=docker.io/dockcross/web-wasi-emulated-threads \
          --build-arg LDFLAGS="${wasi_ld_flags}" \
          --build-arg CFLAGS="${wasi_c_flags}" \
          $script_dir $@
        if $version_tag; then
                $exe $build_cmd $tag_flag docker.io/itkwasm/wasi-base:${TAG}-$host_arch \
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
                        $script_dir $@
        fi
fi


if $debug; then
  $exe $build_cmd $tag_flag docker.io/itkwasm/emscripten-base:latest-debug-$host_arch \
          --build-arg IMAGE=docker.io/itkwasm/emscripten-base \
          --build-arg HOST_ARCH=$host_arch \
          --build-arg CMAKE_BUILD_TYPE=Debug \
          --build-arg USE_DCMTK=OFF \
          --build-arg VERSION=latest-debug \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          --build-arg LDFLAGS="${emscripten_debug_ld_flags}" \
          --build-arg CFLAGS="${emscripten_debug_c_flags}" \
          $script_dir $@
  if $version_tag; then
        $exe $build_cmd $tag_flag docker.io/itkwasm/emscripten-base:${TAG}-debug-$host_arch \
                --build-arg IMAGE=docker.io/itkwasm/emscripten-base \
                --build-arg HOST_ARCH=$host_arch \
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
  $exe $build_cmd $tag_flag docker.io/itkwasm/emscripten-base:latest-threads-debug-$host_arch \
          --build-arg IMAGE=docker.io/itkwasm/emscripten-base \
          --build-arg HOST_ARCH=$host_arch \
          --build-arg CMAKE_BUILD_TYPE=Debug \
          --build-arg USE_DCMTK=OFF \
          --build-arg VERSION=${TAG}-threads-debug \
          --build-arg VCS_REF=${VCS_REF} \
          --build-arg VCS_URL=${VCS_URL} \
          --build-arg BUILD_DATE=${BUILD_DATE} \
          --build-arg LDFLAGS="${emscripten_threads_debug_ld_flags}" \
          --build-arg CFLAGS="${emscripten_threads_debug_c_flags}" \
          $script_dir $@
  if $version_tag; then
        $exe $build_cmd $tag_flag docker.io/itkwasm/emscripten-base:${TAG}-threads-debug-$host_arch \
                --build-arg IMAGE=docker.io/itkwasm/emscripten-base \
                --build-arg HOST_ARCH=$host_arch \
                --build-arg CMAKE_BUILD_TYPE=Debug \
                --build-arg USE_DCMTK=OFF \
                --build-arg VERSION=${TAG}-debug \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                --build-arg LDFLAGS="${emscripten_threads_debug_ld_flags}" \
                --build-arg CFLAGS="${emscripten_threads_debug_c_flags}" \
                $script_dir $@
  fi
  if $wasi; then
    $exe $build_cmd $tag_flag docker.io/itkwasm/wasi-base:latest-debug-$host_arch \
            --build-arg IMAGE=docker.io/itkwasm/wasi-base \
            --build-arg HOST_ARCH=$host_arch \
            --build-arg CMAKE_BUILD_TYPE=Debug \
            --build-arg VCS_REF=${VCS_REF} \
            --build-arg VCS_URL=${VCS_URL} \
            --build-arg BUILD_DATE=${BUILD_DATE} \
            --build-arg BASE_IMAGE=docker.io/dockcross/web-wasi-emulated-threads \
            --build-arg LDFLAGS="${wasi_debug_ld_flags}" \
            --build-arg CFLAGS="${wasi_debug_c_flags}" \
            $script_dir $@
    if $version_tag; then
        $exe $build_cmd $tag_flag docker.io/itkwasm/wasi-base:${TAG}-debug-$host_arch \
                --build-arg IMAGE=docker.io/itkwasm/wasi-base \
                --build-arg HOST_ARCH=$host_arch \
                --build-arg CMAKE_BUILD_TYPE=Debug \
                --build-arg VERSION=${TAG} \
                --build-arg VCS_REF=${VCS_REF} \
                --build-arg VCS_URL=${VCS_URL} \
                --build-arg BUILD_DATE=${BUILD_DATE} \
                --build-arg BASE_IMAGE=docker.io/dockcross/web-wasi-emulated-threads \
                --build-arg LDFLAGS="${wasi_debug_ld_flags}" \
                --build-arg CFLAGS="${wasi_debug_c_flags}" \
                $script_dir $@
    fi
  fi
fi
