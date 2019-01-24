#!/bin/sh

script_dir="`cd $(dirname $0); pwd`"

TAG=$(date '+%Y%m%d')-$(git rev-parse --short HEAD)

docker build -t insighttoolkit/itk-js-base:latest \
        --build-arg IMAGE=insighttoolkit/itk-js-base \
        --build-arg VCS_REF=`git rev-parse --short HEAD` \
        --build-arg VCS_URL=`git config --get remote.origin.url` \
        --build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` \
        $script_dir
docker build -t insighttoolkit/itk-js-base:${TAG} \
        --build-arg IMAGE=insighttoolkit/itk-js-base \
        --build-arg VERSION=${TAG} \
        --build-arg VCS_REF=`git rev-parse --short HEAD` \
        --build-arg VCS_URL=`git config --get remote.origin.url` \
        --build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` \
        $script_dir
