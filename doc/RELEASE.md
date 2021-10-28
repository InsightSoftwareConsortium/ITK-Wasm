- To release a new version of itk-wasm on npmjs:

Verify the source tree.

```
git checkout master
git pull upstream master
git clean -fdx
npm ci
version=6.0.0 # change to correct version

# Update the default CLI image in src/itk-wasm-cli.js
# Based on:
#
#   echo $(date '+%Y%m%d')-$(git rev-parse --short HEAD)
#
./src/docker/build.sh
# DockerHub credential environmental variables must be set
./src/docker/push.sh
git add -- src/itk-wasm-cli.js
git commit -m "feat(itk-wasm-cli): Update default Docker image for ${version}"
```

Bump `version` in `package.json`, `package-lock.json`, `src/itkConfig.ts`.

```
git add -- package.json package-lock.json src/itkConfig.ts
git commit -m "feat(version): Bump NPM version to ${version}"
npm run build
npm run test
npm publish
cd dist/image-io
npm publish
cd -
cd dist/mesh-io
npm publish
cd -
cd dist/polydata-io
npm publish
cd -
git tag -m "itk-wasm ${version}" -s itk-wasm-v$version HEAD
git checkout release
git merge master
git push --tags upstream release master
```
