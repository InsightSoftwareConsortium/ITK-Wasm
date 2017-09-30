#!/bin/sh

script_dir="`cd $(dirname $0); pwd`"

docker run \
  --rm \
  -v $script_dir/../..:/usr/src/itk-js \
    insighttoolkit/bridgejavascript:latest \
      /usr/src/itk-js/test/Docker/test.sh
