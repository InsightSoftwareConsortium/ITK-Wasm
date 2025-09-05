#!/usr/bin/env bash

script_dir="`cd $(dirname $0); pwd`"
source "$script_dir/oci_exe.sh"
exe=$(ociExe)

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

$exe pull docker.io/itkwasm/emscripten:latest
$exe tag docker.io/itkwasm/emscripten:latest localhost/itkwasm/emscripten:latest
$exe pull docker.io/itkwasm/emscripten:latest-threads
$exe tag docker.io/itkwasm/emscripten:latest-threads localhost/itkwasm/emscripten:latest-threads
if $debug; then
  $exe pull docker.io/itkwasm/emscripten:latest-debug
  $exe tag docker.io/itkwasm/emscripten:latest-debug localhost/itkwasm/emscripten:latest-debug
  $exe pull docker.io/itkwasm/emscripten:latest-threads-debug
  $exe tag docker.io/itkwasm/emscripten:latest-threads-debug localhost/itkwasm/emscripten:latest-threads-debug
fi

$exe pull docker.io/itkwasm/wasi:latest
$exe tag docker.io/itkwasm/wasi:latest localhost/itkwasm/wasi:latest
if $debug; then
  $exe pull docker.io/itkwasm/wasi:latest-debug
  $exe tag docker.io/itkwasm/wasi:latest-debug localhost/itkwasm/wasi:latest-debug
fi
