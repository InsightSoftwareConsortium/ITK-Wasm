#!/usr/bin/env bash

script_dir="`cd $(dirname $0); pwd`"
exe=buildah

set -eo pipefail

debug=true
for param; do
  if [[ $param == '--no-debug' ]]; then
    debug=false
  else
    newparams+=("$param")
  fi
done
set -- "${newparams[@]}"  # overwrites the original positional params

TAG=$(date '+%Y%m%d')-$(git rev-parse --short HEAD)

if test ! -z ${DOCKERHUB_ITKWasm_PASSWORD+x}; then
  echo $DOCKERHUB_ITKWasm_PASSWORD | $exe login --username "$DOCKERHUB_ITKWasm_USERNAME" --password-stdin
fi

function push_image() {
  local image=$1
  local tag=$2
  local debug=$3
  $exe push localhost/${image}:${tag} docker://docker.io/${image}:${tag}
  $exe push localhost/${image}:${tag} docker://quay.io/${image}:${tag}
  if $debug; then
    $exe push localhost/${image}:${tag}-debug docker://docker.io/${image}:${tag}-debug
    $exe push localhost/${image}:${tag}-debug docker://quay.io/${image}:${tag}-debug
  fi
}

push_image itkwasm/wasi ${TAG} ${debug}
push_image itkwasm/wasi-base ${TAG} ${debug}
push_image itkwasm/emscripten ${TAG} ${debug}
push_image itkwasm/emscripten-base ${TAG} ${debug}
push_image itkwasm/wasi latest ${debug}
push_image itkwasm/wasi-base latest ${debug}
push_image itkwasm/emscripten latest ${debug}
push_image itkwasm/emscripten-base latest ${debug}
