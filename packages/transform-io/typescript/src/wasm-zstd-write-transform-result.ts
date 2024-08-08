// Generated file. To retain edits, remove this comment.

import { JsonCompatible, BinaryFile, WorkerPoolFunctionResult } from 'itk-wasm'

interface WasmZstdWriteTransformResult extends WorkerPoolFunctionResult {
  /** Whether the input could be written. If false, the output transform is not valid. */
  couldWrite: JsonCompatible

  /** Output transform serialized in the file format. */
  serializedTransform: BinaryFile

}

export default WasmZstdWriteTransformResult
