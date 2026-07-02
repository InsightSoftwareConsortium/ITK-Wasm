// Generated file. To retain edits, remove this comment.

import { JsonCompatible, WorkerPoolFunctionResult } from 'itk-wasm'

interface ResampleBoundingBoxResult extends WorkerPoolFunctionResult {
  /** The padded moving-image region needed to resample the fixed image grid, as a bounding box (JSON) */
  boundingBox: JsonCompatible

}

export default ResampleBoundingBoxResult
