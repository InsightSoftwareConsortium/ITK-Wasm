- To release a new version of itk-wasm on npmjs:

Verify the source tree.

```

# on an amd64 system
# DockerHub, quay.io login required
pixi run build-docker-images --with-debug
./src/docker/push.sh

# on a linux arm64 system
pixi run build-docker-images --with-debug --multiarch
./src/docker/push.sh

pnpm build && pnpm test

git add -- packages/core/typescript/itk-wasm/src/cli/default-image-tag.js
git commit -m "feat(itk-wasm-cli): Update default Docker image for $(date '+%Y%m%d')-$(git rev-parse --short HEAD)"
```
