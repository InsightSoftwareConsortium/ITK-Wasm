// Generated file. To retain edits, remove this comment.

import { WorkerPoolFunctionOption } from 'itk-wasm'

interface DownsampleOptions extends WorkerPoolFunctionOption {
  /** Shrink factors */
  shrinkFactors: number[]

  /** Optional crop radius in pixel units. */
  cropRadius?: number[]

}

export default DownsampleOptions
