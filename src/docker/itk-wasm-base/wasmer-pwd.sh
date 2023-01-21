#!/usr/bin/env bash

# Mount the PWD to enable access in try_run commands
exec ${WasmER_DIR}/bin/wasmer run --dir=. --dir=$PWD "$@"
