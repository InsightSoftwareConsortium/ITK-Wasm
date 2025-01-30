#!/usr/bin/env bash

set -exo pipefail

host_arch=$(uname -m | sed -e 's/x86_64/x64/' -e 's/aarch64/arm64/')

curl -LO https://nodejs.org/dist/${NODE_TAG}/node-${NODE_TAG}-linux-${host_arch}.tar.xz
tar xvJf node-${NODE_TAG}-linux-${host_arch}.tar.xz
rm node-${NODE_TAG}-linux-${host_arch}.tar.xz
mkdir -p /emsdk/upstream/emscripten/
ln -s /node-${NODE_TAG}-linux-${host_arch}/bin/node /emsdk/upstream/emscripten
ln -s /node-${NODE_TAG}-linux-${host_arch}/bin/npm /emsdk/upstream/emscripten
ln -s /node-${NODE_TAG}-linux-${host_arch}/bin/npx /emsdk/upstream/emscripten
