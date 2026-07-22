- To release a new version of itk-wasm on npmjs:

Verify the source tree.

```

# on an arm64 system
# DockerHub login required
pixi run src/docker/build-docker-images.sh --with-debug
./src/docker/push.sh

# on a linux amd64 system
export OCI_EXE=docker
pixi run src/docker/build-docker-images.sh --with-debug
# requires manifest-tool, see https://github.com/estesp/manifest-tool/releases/
./src/docker/push.sh --push-manifest && ./src/docker/pull.sh

pnpm clean && pnpm install && pnpm build && pnpm test

git add -- packages/core/typescript/itk-wasm/src/cli/default-image-tag.js
git commit -m "feat(itk-wasm-cli): update default Docker image for $(date '+%Y%m%d')-$(git rev-parse --short=9 HEAD)"
```

> **Note — why not `pixi run build-docker-images`?**
> Recent pixi (>= 0.56) follows symbolic links and ignores `.gitignore` when it
> hashes a task's `inputs`/`outputs` to decide whether the task can be skipped.
> Our pnpm workspace `node_modules` contains self-referential symlink cycles
> (e.g. `packages/*/typescript/node_modules/@itk-wasm/<name>-build -> ../../..`),
> so that walk aborts the task before Docker even starts:
>
> ```
> Error:   × walk error at <repo>
>   ╰─▶ File system loop found: .../node_modules/... points to an ancestor ...
> ```
>
> `build-docker-images` itself has no `inputs`/`outputs`, but its prerequisite
> tasks (`export-itk-wasm-env-vars`, `update-default-image-tag`) do, so the whole
> command fails. A raw `pixi run <command>` does **not** perform the task-cache
> walk, so [`src/docker/build-docker-images.sh`](./build-docker-images.sh) runs
> those prerequisites' commands directly and then calls `src/docker/build.sh`.
> It is a drop-in replacement — same images, same `default-image-tag.js` update.
>
> Remove the wrapper and go back to `pixi run build-docker-images --with-debug`
> once the fix lands upstream (pixi's input/output walker should skip symlink
> loops instead of aborting): https://github.com/prefix-dev/pixi

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
