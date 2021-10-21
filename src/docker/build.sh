#!/usr/bin/env bash

script_dir="`cd $(dirname $0); pwd`"

$script_dir/itk-js-base/build.sh --with-debug --with-wasi $@
$script_dir/itk-js/build.sh --with-debug --with-wasi $@
$script_dir/itk-js-vtk/build.sh --with-debug $@
