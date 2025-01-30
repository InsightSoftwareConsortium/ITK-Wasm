// Generated file. To retain edits, remove this comment.

import { WorkerPoolFunctionOption } from 'itk-wasm'

interface SmoothRemeshOptions extends WorkerPoolFunctionOption {
  /** Number of points as a percent of the bounding box diagonal. Output may have slightly more points. */
  numberPoints?: number

  /** Triangle shape adaptation factor. Use 0.0 to disable. */
  triangleShapeAdaptation?: number

  /** Triangle size adaptation factor. Use 0.0 to disable. */
  triangleSizeAdaptation?: number

  /** Number of normal smoothing iterations. */
  normalIterations?: number

  /** Number of Lloyd relaxation iterations. */
  lloydIterations?: number

  /** Number of Newton iterations. */
  newtonIterations?: number

  /** Number of Newton evaluations per step for Hessian approximation. */
  newtonM?: number

  /** Number of samples for size adaptation if triangle size adaptation is not 0.0. */
  lfsSamples?: number

}

export default SmoothRemeshOptions
