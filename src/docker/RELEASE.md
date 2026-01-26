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

## Building with a Local ITK Repository

To test ITK bug fixes or develop new features for the wasm toolchains, you can build Docker images using a local ITK source directory instead of cloning from the remote repository.

### Using the `--local-itk` Argument

```bash
# Clone ITK locally (if not already present)
git clone https://github.com/InsightSoftwareConsortium/ITK.git /path/to/local/ITK
cd /path/to/local/ITK
git checkout <your-branch-or-commit>

# Build Docker images with local ITK source
./src/docker/build.sh --local-itk /path/to/local/ITK
# Or for individual image builds:
./src/docker/itk-wasm-base/build.sh --local-itk /path/to/local/ITK --with-wasi
```

### Using the `ITK_WASM_LOCAL_ITK_SOURCE` Environment Variable

Alternatively, set the environment variable for scripting or CI workflows:

```bash
export ITK_WASM_LOCAL_ITK_SOURCE=/path/to/local/ITK
./src/docker/build.sh
```

### Notes

- The local ITK source is copied into the Docker build context, so changes to the local directory after starting the build will not be reflected.
- DCMTK patches are automatically applied to the local ITK source during the Docker build.
- This is useful for:
  - Testing ITK bug fixes before they are merged upstream
  - Developing new ITK features for wasm toolchains
  - Debugging ITK issues specific to Emscripten or WASI builds
