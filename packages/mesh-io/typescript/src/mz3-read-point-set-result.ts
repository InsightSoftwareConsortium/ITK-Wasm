// Generated file. To retain edits, remove this comment.

import { JsonCompatible, PointSet, WorkerPoolFunctionResult } from 'itk-wasm'

interface Mz3ReadPointSetResult extends WorkerPoolFunctionResult {
  /** Whether the input could be read. If false, the output point set is not valid. */
  couldRead: JsonCompatible

  /** Output point set */
  pointSet: PointSet

}

export default Mz3ReadPointSetResult