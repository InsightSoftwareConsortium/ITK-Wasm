- To release a new version of itk-wasm on npmjs:

Verify the source tree.

```
git checkout main
git pull upstream main
git clean -fdx
git checkout -b docker-bump
npm ci

# Update the `defaultImageTag` in src/itk-wasm-cli.js
# Based on:
#
#   echo $(date '+%Y%m%d')-$(git rev-parse --short HEAD)
#
./src/docker/build.sh --with-debug
# DockerHub credential environmental variables must be set
./src/docker/push.sh
git add -- src/itk-wasm-cli.js
git commit -m "feat(itk-wasm-cli): Update default Docker image for $(date '+%Y%m%d')-$(git rev-parse --short HEAD)"
```
