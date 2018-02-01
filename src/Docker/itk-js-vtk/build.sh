#!/bin/sh

script_dir="`cd $(dirname $0); pwd`"

docker build -t kitware/itk-js-vtk:latest $script_dir
