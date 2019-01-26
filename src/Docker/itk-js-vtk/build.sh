#!/bin/sh

script_dir="`cd $(dirname $0); pwd`"

TAG=$(date '+%Y%m%d')-$(git rev-parse --short HEAD)

docker build "$@" -t kitware/itk-js-vtk:latest \
        --build-arg IMAGE=kitware/itk-js-vtk \
        --build-arg VCS_REF=`git rev-parse --short HEAD` \
        --build-arg VCS_URL=`git config --get remote.origin.url` \
        --build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` \
        $script_dir
docker build "$@" -t kitware/itk-js-vtk:${TAG} \
        --build-arg IMAGE=kitware/itk-js-vtk \
        --build-arg VERSION=${TAG} \
        --build-arg VCS_REF=`git rev-parse --short HEAD` \
        --build-arg VCS_URL=`git config --get remote.origin.url` \
        --build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` \
        $script_dir
