// Generated file. To retain edits, remove this comment.

import { JsonCompatible, Mesh } from 'itk-wasm'

interface WasmZstdReadMeshNodeResult {
  /** Whether the input could be read. If false, the output mesh is not valid. */
  couldRead: JsonCompatible

  /** Output mesh */
  mesh: Mesh

}

export default WasmZstdReadMeshNodeResult
