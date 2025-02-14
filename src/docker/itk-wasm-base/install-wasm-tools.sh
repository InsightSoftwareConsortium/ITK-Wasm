#!/usr/bin/env bash

set -exo pipefail

host_arch=$(uname -m)

curl -LO https://github.com/bytecodealliance/wasm-tools/releases/download/v${wasm_tools_GIT_TAG}/wasm-tools-${wasm_tools_GIT_TAG}-${host_arch}-linux.tar.gz
tar xvzf wasm-tools-${wasm_tools_GIT_TAG}-${host_arch}-linux.tar.gz
cp wasm-tools-${wasm_tools_GIT_TAG}-${host_arch}-linux/wasm-tools /usr/local/bin/
rm -rf wasm-tools-${wasm_tools_GIT_TAG}-${host_arch}-linux*
