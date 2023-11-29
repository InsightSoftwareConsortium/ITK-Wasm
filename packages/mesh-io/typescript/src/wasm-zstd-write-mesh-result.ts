// Generated file. To retain edits, remove this comment.

import { JsonCompatible, BinaryFile } from 'itk-wasm'

interface WasmZstdWriteMeshResult {
  /** WebWorker used for computation */
  webWorker: Worker | null

  /** Whether the input could be written. If false, the output mesh is not valid. */
  couldWrite: JsonCompatible

  /** Output mesh */
  serializedMesh: BinaryFile

}

export default WasmZstdWriteMeshResult
