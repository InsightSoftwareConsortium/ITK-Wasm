#!/bin/sh

if [ $BASE_IMAGE = "insighttoolkit/itk-js-base" ]; then
  cd /MedianFilterPipelineCopy

  /usr/local/bin/web-build -DCMAKE_EXE_LINKER_FLAGS='-fltothin -s DISABLE_EXCEPTION_CATCHING=0'
  rm -rf ./web-build

  /usr/local/bin/web-build -DCMAKE_EXE_LINKER_FLAGS='-flto -s DISABLE_EXCEPTION_CATCHING=1'

  rm -rf /MedianFilterPipelineCopy
  chmod -R 777 /emsdk/upstream/emscripten/cache
fi
