#!/usr/bin/env bash

# Generate documentation for the model

script_dir="`cd $(dirname $0); pwd`"
cd $script_dir

gen-markdown -d ../docs/model ./itk-wasm.yml
sed -i 's/# itk-wasm/# LinkML Model/' ../docs/model/index.md
sed -i 's/metamodel version/\[LinkML\]\(https:\/\/linkml.io\) metamodel version/' ../docs/model/index.md
sed -i 's/\*\*version:\*\*/**ITK-Wasm model version:**/' ../docs/model/index.md
