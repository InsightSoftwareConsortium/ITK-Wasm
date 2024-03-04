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

$exe pull quay.io/itkwasm/emscripten:latest
if $debug; then
  $exe pull quay.io/itkwasm/emscripten:latest-debug
fi

$exe pull quay.io/itkwasm/wasi:latest
if $debug; then
  $exe pull quay.io/itkwasm/wasi:latest-debug
fi
