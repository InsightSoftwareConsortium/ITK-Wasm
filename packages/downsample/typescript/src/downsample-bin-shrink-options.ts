// Generated file. To retain edits, remove this comment.

import { WorkerPoolFunctionOption } from 'itk-wasm'

interface DownsampleBinShrinkOptions extends WorkerPoolFunctionOption {
  /** Shrink factors */
  shrinkFactors: number[]

  /** Generate output image information only. Do not process pixels. */
  informationOnly?: boolean

}

export default DownsampleBinShrinkOptions
