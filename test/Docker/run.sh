#!/bin/sh

script_dir="`cd $(dirname $0); pwd`"

docker run \
  --rm \
  -v $script_dir/../..:/usr/src/ITKBridgeJavaScript \
    insighttoolkit/bridgejavascript:latest \
      /usr/src/ITKBridgeJavaScript/test/Docker/test.sh
