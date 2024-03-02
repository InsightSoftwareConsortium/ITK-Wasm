#!/usr/bin/env bash

script_dir="`cd $(dirname $0); pwd`"
source "$script_dir/oci_exe.sh"
exe=$(ociExe)

set -eo pipefail

$exe pull quay.io/itkwasm/emscripten:latest
$exe pull quay.io/itkwasm/emscripten:latest-debug

$exe pull quay.io/itkwasm/wasi:latest
$exe pull quay.io/itkwasm/wasi:latest-debug
