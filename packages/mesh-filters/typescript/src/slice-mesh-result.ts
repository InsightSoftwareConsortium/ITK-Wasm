// Generated file. To retain edits, remove this comment.

import { Mesh, WorkerPoolFunctionResult } from 'itk-wasm'

interface SliceMeshResult extends WorkerPoolFunctionResult {
  /** The output mesh comprised of polylines. Cell data indicates whether part of a closed line. Point data indicates the slice index. */
  polylines: Mesh

}

export default SliceMeshResult
