- To release a new version of itk-wasm on npmjs:

Verify the source tree.

```
# Remove all old podman images
podman rmi $(podman images -qa) -f && podman rmi $(podman images -qa) -f
pixi run build-docker-images --with-debug --multiarch

# DockerHub credential environmental variables must be set
./src/docker/push.sh

pnpm build && pnpm test

git add -- packages/core/typescript/itk-wasm/src/cli/default-image-tag.js
git commit -m "feat(itk-wasm-cli): Update default Docker image for $(date '+%Y%m%d')-$(git rev-parse --short HEAD)"
```
