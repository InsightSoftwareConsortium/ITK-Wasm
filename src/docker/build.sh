#!/usr/bin/env bash

script_dir="`cd $(dirname $0); pwd`"

$script_dir/itk-wasm-base/build.sh --with-wasi $@
$script_dir/itk-wasm/build.sh --with-wasi $@
$script_dir/itk-wasm-vtk/build.sh $@
