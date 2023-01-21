#!/usr/bin/env bash

# Mount the PWD to enable access in try_run commands
exec ${WasmTIME_HOME}/bin/wasmtime run --dir=. --dir=$PWD "$@"
