#!/usr/bin/env bash

# Mount the PWD to enable access in try_run commands
exec /usr/local/wasmer/bin/wasmer run --dir=. --dir=$PWD "$@"
