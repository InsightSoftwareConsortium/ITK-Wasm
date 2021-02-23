#!/usr/bin/env bash

set -eo pipefail

script_dir="`cd $(dirname $0); pwd`"

TAG=$(date '+%Y%m%d')-$(git rev-parse --short HEAD)

docker build -t insighttoolkit/itk-js-base:latest \
        --build-arg IMAGE=insighttoolkit/itk-js-base \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg VCS_REF=`git rev-parse --short HEAD` \
        --build-arg VCS_URL=`git config --get remote.origin.url` \
        --build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` \
        $script_dir
docker build -t insighttoolkit/itk-js-base:${TAG} \
        --build-arg IMAGE=insighttoolkit/itk-js-base \
        --build-arg CMAKE_BUILD_TYPE=Release \
        --build-arg VERSION=${TAG} \
        --build-arg VCS_REF=`git rev-parse --short HEAD` \
        --build-arg VCS_URL=`git config --get remote.origin.url` \
        --build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` \
        $script_dir

if [[ \ $*\  == *\ --with-debug\ * ]]; then
  docker build -t insighttoolkit/itk-js-base:${TAG}-debug \
          --build-arg IMAGE=insighttoolkit/itk-js-base \
          --build-arg CMAKE_BUILD_TYPE=Debug \
          --build-arg USE_DCMTK=OFF \
          --build-arg VERSION=${TAG}-debug \
          --build-arg VCS_REF=`git rev-parse --short HEAD` \
          --build-arg VCS_URL=`git config --get remote.origin.url` \
          --build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` \
          $script_dir
fi
