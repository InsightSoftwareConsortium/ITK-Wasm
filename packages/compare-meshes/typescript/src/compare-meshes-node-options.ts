// Generated file. To retain edits, remove this comment.

import { Mesh } from 'itk-wasm'

interface CompareMeshesNodeOptions {
  /** Baseline images to compare against */
  baselineMeshes: Mesh[]

  /** Difference for point components to be considered different. */
  pointsDifferenceThreshold?: number

  /** Number of points whose points exceed the difference threshold that can be different before the test fails. */
  numberOfDifferentPointsTolerance?: number

  /** Difference for point data components to be considered different.  */
  pointDataDifferenceThreshold?: number

  /** Number of point data that can exceed the difference threshold before the test fails. */
  numberOfPointDataTolerance?: number

  /** Difference for cell data components to be considered different. */
  cellDataDifferenceThreshold?: number

  /** Number of cell data that can exceed the difference threshold before the test fails. */
  numberOfCellDataTolerance?: number

}

export default CompareMeshesNodeOptions
