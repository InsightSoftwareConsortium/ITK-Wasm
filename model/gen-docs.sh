#!/usr/bin/env bash

# Generate documentation for the model

script_dir="`cd $(dirname $0); pwd`"
cd $script_dir

gen-markdown -d ../docs/model ./itk-wasm.yml