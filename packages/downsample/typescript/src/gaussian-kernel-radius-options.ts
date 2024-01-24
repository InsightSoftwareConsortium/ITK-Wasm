// Generated file. To retain edits, remove this comment.

import { WorkerPoolFunctionOption } from 'itk-wasm'

interface GaussianKernelRadiusOptions extends WorkerPoolFunctionOption {
  /** Size in pixels */
  size: number[]

  /** Sigma in pixel units */
  sigma: number[]

  /** Maximum kernel width in pixels. */
  maxKernelWidth?: number

  /** Maximum kernel error. */
  maxKernelError?: number

}

export default GaussianKernelRadiusOptions
