#!/usr/bin/env bash
#
# Shell equivalent of the `pixi run build-docker-images` task.
#
# WORKAROUND: pixi >= 0.56 follows symbolic links (and ignores .gitignore) when
# hashing a task's `inputs`/`outputs` for its "can this task be skipped?" cache.
# Our pnpm workspace `node_modules` contains self-referential symlink cycles
# (e.g. `packages/*/typescript/node_modules/@itk-wasm/<name>-build -> ../../..`),
# so that walk aborts every affected task with:
#
#   Error: × walk error at <repo>
#     ╰─▶ File system loop found: .../node_modules/... points to an ancestor ...
#
# `build-docker-images` itself declares no inputs/outputs, but its prerequisite
# tasks `export-itk-wasm-env-vars` and `update-default-image-tag` do, so the
# task crashes before Docker is ever invoked. Raw `pixi run <cmd>` does NOT do
# the task-cache walk, so this script runs those prerequisites' commands
# directly and then invokes the real build.
#
# Run it INSIDE the pixi environment so the ITK_WASM_* variables are exported by
# activation:
#
#   pixi run src/docker/build-docker-images.sh --with-debug
#
# All arguments (e.g. --with-debug) are passed through to src/docker/build.sh.
#
# Remove this script once the upstream fix lands (pixi's task input/output
# walker should not abort on symlink loops): https://github.com/prefix-dev/pixi
set -eo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
cd "$repo_root"

# export-itk-wasm-env-vars: provide ITK_WASM_* variables to the Docker image.
env | grep ITK_WASM | grep -v TEST > src/docker/itk-wasm-base/itk_wasm_env_vars.sh

# update-default-image-tag: keep the itk-wasm CLI default in sync with this build.
sed -i "s/const defaultImageTag = '.*'/const defaultImageTag = '${ITK_WASM_DEV_DOCKER_TAG}'/g" \
  packages/core/typescript/itk-wasm/src/cli/default-image-tag.js

# build-docker-images: build the base + toolchain images.
src/docker/build.sh "$@"
