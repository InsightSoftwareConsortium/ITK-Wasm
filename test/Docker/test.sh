#!/bin/bash

# This is a script to build the modules and run the test suite in the base
# Docker container.

set -x
set -o

cd /usr/src/itk-js
branch=$(git rev-parse --abbrev-ref HEAD)
date=$(date +%F_%H_%M_%S)
sha=$(git rev-parse --short HEAD)

cd /usr/src/itk-js-build
cmake \
  -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE} \
  -G Ninja \
  -DITK_DIR:PATH=/usr/src/ITK-build \
  -DCMAKE_BUILD_TYPE:STRING=Release \
  -DBUILDNAME:STRING=External-BridgeJavaScript-${branch}-${date}-${sha} \
    /usr/src/itk-js
ctest -VV -D Experimental
