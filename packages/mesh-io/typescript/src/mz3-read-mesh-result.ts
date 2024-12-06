// Generated file. To retain edits, remove this comment.

import { JsonCompatible, Mesh, WorkerPoolFunctionResult } from 'itk-wasm'

interface Mz3ReadMeshResult extends WorkerPoolFunctionResult {
  /** Whether the input could be read. If false, the output mesh is not valid. */
  couldRead: JsonCompatible

  /** Output mesh */
  mesh: Mesh

}

export default Mz3ReadMeshResult
