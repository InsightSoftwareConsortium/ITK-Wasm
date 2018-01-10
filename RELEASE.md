- To release a new version of itk.js on npmjs:

Verify the source tree.

```
git checkout master
git pull upstream master
git clean -fdx
npm install
npm run build
npm run test
```

Bump `version` in `package.json`.

```
version=6.0.0 # change to correct version
git commit -m "feat(version): Bump NPM version to ${version}"
cp LICENSE README.md package.json dist/
cd dist
npm publish
git tag -m "itk.js ${version}" -s v$version HEAD
git push --tags upstream master
```
