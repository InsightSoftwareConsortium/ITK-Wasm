#!/usr/bin/env bash

set -exo pipefail

if test -n "$EMSCRIPTEN_VERSION"; then
  cd /median-filter-pipelineCopy
  /usr/local/bin/web-build emscripten-build -DCMAKE_EXE_LINKER_FLAGS='-flto=thin -s DISABLE_EXCEPTION_CATCHING=0'
  rm -rf ./web-build
  /usr/local/bin/web-build emscripten-build -DCMAKE_EXE_LINKER_FLAGS='-flto -s DISABLE_EXCEPTION_CATCHING=0'
  rm -rf ./web-build; /usr/local/bin/web-build emscripten-build -DCMAKE_EXE_LINKER_FLAGS='-fno-lto -s DISABLE_EXCEPTION_CATCHING=1'
  rm -rf /median-filter-pipelineCopy
  mkdir -p /emsdk/upstream/emscripten/cache/symbol_lists
  touch /emsdk/upstream/emscripten/cache/symbol_lists.lock
  chmod -R 777 /emsdk/upstream/emscripten/cache
fi
