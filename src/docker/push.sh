#!/usr/bin/env bash

set -eox pipefail

script_dir="`cd $(dirname $0); pwd`"
source "$script_dir/oci_exe.sh"
exe=$(ociExe)

debug=true
push_manifest=false
for param; do
  if [[ $param == '--no-debug' ]]; then
    debug=false
  elif [[ $param == '--push-manifest' ]]; then
    push_manifest=true
    exe="buildah"
  else
    newparams+=("$param")
  fi
done
set -- "${newparams[@]}"  # overwrites the original positional params

TAG=$(date '+%Y%m%d')-$(git rev-parse --short HEAD)
host_arch=$(uname -m | sed -e 's/x86_64/amd64/' -e 's/aarch64/arm64/')

if test ! -z ${DOCKERHUB_ITKWasm_PASSWORD+x}; then
  echo $DOCKERHUB_ITKWasm_PASSWORD | $exe login --username "$DOCKERHUB_ITKWasm_USERNAME" --password-stdin
fi

function push_image() {
  local image=$1
  local tag=$2
  local debug=$3

  $exe tag quay.io/${image}:${tag}-${host_arch} docker.io/${image}:${tag}-${host_arch}
  $exe push docker.io/${image}:${tag}-${host_arch}
  $exe push quay.io/${image}:${tag}-${host_arch}

  if $debug; then
    $exe tag quay.io/${image}:${tag}-debug-${host_arch} docker.io/${image}:${tag}-debug-${host_arch}
    $exe push docker.io/${image}:${tag}-debug-${host_arch}
    $exe push quay.io/${image}:${tag}-debug-${host_arch}
  fi

  if $push_manifest; then
    $exe manifest push --all --format v2s2 quay.io/${image}:${tag} docker://docker.io/${image}:${tag}
    $exe manifest push --all --format v2s2 quay.io/${image}:${tag} docker://quay.io/${image}:${tag}

    if $debug; then
      $exe manifest push --all --format v2s2 quay.io/${image}:${tag}-debug docker://docker.io/${image}:${tag}-debug
      $exe manifest push --all --format v2s2 quay.io/${image}:${tag}-debug docker://quay.io/${image}:${tag}-debug
    fi
  fi
}

push_image itkwasm/wasi ${TAG} ${debug}
push_image itkwasm/emscripten ${TAG} ${debug}
push_image itkwasm/wasi latest ${debug}
push_image itkwasm/emscripten latest ${debug}
if ! $push_manifest; then
  push_image itkwasm/emscripten-base ${TAG} ${debug}
  push_image itkwasm/wasi-base ${TAG} ${debug}
  push_image itkwasm/wasi-base latest ${debug}
  push_image itkwasm/emscripten-base latest ${debug}
fi

echo "Success."