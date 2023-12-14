# itk-wasm breaking changes

This is a log of itk-wasm breaking changes in the 1.0 beta pre-release. We work to
limit any breaking changes to when they are needed, provide backwards
compatible interfaces when possible, and document breaking changes. However,
for long-term improvement of the package, breaking changes are occasionally
needed. These changes are noted here.

For a log and guide when transitioning from itk.js to itk-wasm,
please see [the migration
guide](doc/content/docs/itk_js_to_itk_wasm_migration_guide.md).

## From 1.0.0-b.158 to 1.0.0-b.159

- itkConfig.js as been replaced by run-time configuration via setPipelineWorkerUrl, setPipelinesBaseUrl
- readDICOMTags has been migrated to @itk-wasm/dicom and as readDicomTags
- readDICOMTagsArrayBuffer has been migrated to @itk-wasm/dicom and as readDicomTags
- readDICOMTagsLocalFile has been migrated to @itk-wasm/dicom and as readDicomTagsNode
- readImageDICOMFileSeries has been migrated to @itk-wasm/dicom as readImageDicomFileSeries
- readImageDICOMArrayBufferSeries has been migrated to @itk-wasm/dicom as readImageDicomFileSeries
- readImageLocalDICOMFileSeries has been migrated to @itk-wasm/dicom as readImageDicomFileSeriesNode
- meshToPolyData, meshToPolyDataNode, polyDataToMesh, polyDataToMeshNode have been migrated to @itk-wasm/mesh-to-poly-data
- High level IO function have been removed: readArrayBuffer, readBlob, readFile, readLocalFile, writeLocalFile

## From 1.0.0-b.101 to 1.0.0-b.102

- apply-presentation-state-to-dicom-image does not take dicom image out flag: was not supported
- apply-presentation-state-to-dicom-image pgm image out flag: always used
- apply-presentation-state-to-dicom-image presentation-state-output flag is prefixed with `no` to disable as a flag
- apply-presentation-state-to-dicom-image bitmap-output flag is prefixed with `no` to disable as a flag
- apply-presentation-state-to-image presentation-state-file is an argument, as
  opposed to an optional parameter, since it is required.
- dicom functions access { data: <Uint8Array>, path: <string> } arguments instead of just <Uint8Array>.
- `.` removed from structured-report-to-html arguments for wrapping
- readDICOMTags moved to the @itk-wasm/dicom package as readDicomTags, api changed
- readDICOMTagsArrayBuffer removed (use readDicomTags)
- readImageDICOMFileSeries moved to @itk-wasm/dicom package as readImageDicomFileSeries, api changed
- readImageDicomFileSeries does not take casting options -- use castImage
- readImageDICOMFileSeriesArrayBuffer removed (use readImageDicomFileSeries)
- @itk-wasm/dicom node functions that take file arguments use the file path string directly

## From 1.0.0-b.72 to 1.0.0-b.73

- Emscripten modules no longer support filesystem-based IO for binary size / performance.

## From 1.0.0-b.61 to 1.0.0-b.62

- WASM renamed to Wasm in C++ classes.

## From 1.0.0-b.51 to 1.0.0-b.52

- The default itkwasm CLI build directory is `emscripten-build` instead of `web-build`.

## From 1.0.0-b.49 to 1.0.0-b.50

- Image.metadata is now a Map instead of an Object.
