# itk-wasm breaking changes

This is a log of itk-wasm breaking changes in the 1.0 beta pre-release. We work to
limit any breaking changes to when they are needed, provide backwards
compatible interfaces when possible, and document breaking changes. However,
for long-term improvement of the package, breaking changes are occasionally
needed. These changes are noted here.

For a log and guide when transitioning from itk.js to itk-wasm,
please see [the migration
guide](doc/content/docs/itk_js_to_itk_wasm_migration_guide.md).

## From 1.0.0-b.72 to 1.0.0-b.73

- Emscripten modules no longer support filesystem-based IO for binary size / performance.

## From 1.0.0-b.61 to 1.0.0-b.62

- WASM renamed to Wasm in C++ classes.

## From 1.0.0-b.51 to 1.0.0-b.52

- The default itkwasm CLI build directory is `emscripten-build` instead of `web-build`.

## From 1.0.0-b.49 to 1.0.0-b.50

- Image.metadata is now a Map instead of an Object.
