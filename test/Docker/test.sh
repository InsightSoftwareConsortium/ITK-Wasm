#!/bin/bash

# This is a script to build the modules and run the test suite in the base
# Docker container.

die() {
  echo "Error: $@" 1>&2
  exit 1;
}

cd /usr/src/ITKBridgeJavaScript-build || die "Could not cd into the build directory"

cmake \
  -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE} \
  -G Ninja \
  -DITK_DIR:PATH=/usr/src/ITK-build \
  -DCMAKE_BUILD_TYPE:STRING=Release \
  -DBUILDNAME:STRING=External-BridgeJavaScript \
    /usr/src/ITKBridgeJavaScript || die "CMake configuration failed"
ctest -VV -D Experimental || die "ctest failed"
