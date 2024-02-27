#!/usr/bin/env bash

script_dir="`cd $(dirname $0); pwd`"
source "$script_dir/oci_exe.sh"
exe=$(ociExe)

set -eo pipefail

$exe pull itkwasm/emscripten:latest
$exe pull itkwasm/emscripten:latest-debug

$exe pull itkwasm/wasi:latest
$exe pull itkwasm/wasi:latest-debug
