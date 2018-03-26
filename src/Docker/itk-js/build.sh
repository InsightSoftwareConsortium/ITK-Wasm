#!/bin/bash

script_dir="`cd $(dirname $0); pwd`"

cd $script_dir

mkdir -p ITKBridgeJavaScriptModuleCopy
rsync -a --exclude=../../../src/Docker ../../../{include,src,CMakeLists.txt,itk-module.cmake} ./ITKBridgeJavaScriptModuleCopy/

docker build -t insighttoolkit/itk-js:latest $script_dir "$@"
