# ITK source patches

Unified diffs in this directory are applied to the ITK source tree while the
`itkwasm/emscripten-base` image is built (see the `git apply` step in
[`../Dockerfile`](../Dockerfile)). They sit on top of the ITK revision pinned
by `ITK_WASM_ITK_REPOSITORY` / `ITK_WASM_ITK_BRANCH` in
[`../../../../itk_wasm_env.bash`](../../../../itk_wasm_env.bash).

Application is idempotent: a patch that is already present in the source tree
(for example, a local ITK checkout used with `USE_LOCAL_ITK=1`) is detected with
`git apply --reverse --check` and skipped.

Each patch is a `git format-patch` file, so it can also be applied with
`git am` and submitted upstream. Remove a patch from this directory once the
change is merged into the pinned ITK branch.

## Patches

- `itk-tiff-uint32-int32.patch` — teach `itk::TIFFImageIO` to read and write
  32-bit integer (`uint32` / `int32`) images. Without it, writing such an image
  throws (aborting the WebAssembly module) and reading one silently yields a
  zero-filled buffer, even though the component types are advertised as
  supported. Fixes
  [ITK-Wasm#1544](https://github.com/InsightSoftwareConsortium/ITK-Wasm/issues/1544).
  Submitted upstream as
  [ITK#6541](https://github.com/InsightSoftwareConsortium/ITK/pull/6541); remove
  this patch once that change is in the pinned ITK branch.
