- To release a new version of itk-wasm on npmjs:

Verify the source tree.

```

# on an arm64 system
# DockerHub, quay.io login required
pixi run build-docker-images --with-debug
./src/docker/push.sh

# on a linux amd64 system
export OCI_EXE=docker
pixi run build-docker-images --with-debug
# requires manifest-tool, see https://github.com/estesp/manifest-tool/releases/
./src/docker/push.sh --push-manifest && ./src/docker/pull.sh

pnpm clean && pnpm install && pnpm build && pnpm test

git add -- packages/core/typescript/itk-wasm/src/cli/default-image-tag.js
git commit -m "feat(itk-wasm-cli): update default Docker image for $(date '+%Y%m%d')-$(git rev-parse --short HEAD)"
```
