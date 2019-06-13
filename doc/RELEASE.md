- To release a new version of itk.js on npmjs:

Verify the source tree.

```
git checkout master
git pull upstream master
git clean -fdx
npm ci
./src/Docker/itk-js-base/build.sh
./src/Docker/itk-js/build.sh
./src/Docker/itk-js-vtk/build.sh
```

Bump `version` in `package.json`.

```
npm run build
npm run test
rm dist/Pipelines/itkJSPipeline*
rm dist/Pipelines/*Test*
version=6.0.0 # change to correct version
git add -- package.json package-lock.json
git commit -m "feat(version): Bump NPM version to ${version}"
cp LICENSE README.md package.json dist/
cd dist
npm publish
cd ..
git tag -m "itk.js ${version}" -s v$version HEAD
git checkout release
git merge master
git push --tags upstream release master
```
