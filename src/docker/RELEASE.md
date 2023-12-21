- To release a new version of itk-wasm on npmjs:

Verify the source tree.

```
git checkout main
git pull upstream main
git clean -fdx
git checkout -b docker-bump
pnpm i

# Update the `defaultImageTag` in packages/core/typescript/itk-wasm/src/cli/default-image-tag.js
# Based on:
#
#   echo $(date '+%Y%m%d')-$(git rev-parse --short HEAD)
#
./src/docker/build.sh --with-debug
# DockerHub credential environmental variables must be set
./src/docker/push.sh
git add -- packages/core/typescript/itk-wasm/src/cli/default-image-tag.js
git commit -m "feat(itk-wasm-cli): Update default Docker image for $(date '+%Y%m%d')-$(git rev-parse --short HEAD)"
```
