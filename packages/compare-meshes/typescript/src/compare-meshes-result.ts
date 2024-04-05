// Generated file. To retain edits, remove this comment.

import { JsonCompatible, Mesh, WorkerPoolFunctionResult } from 'itk-wasm'

interface CompareMeshesResult extends WorkerPoolFunctionResult {
  /** Metrics for the closest baseline. */
  metrics: JsonCompatible

  /** Mesh with the differences between the points of the test mesh and the closest baseline. */
  pointsDifferenceMesh: Mesh

  /** Mesh with the differences between the point data of the test mesh and the closest baseline. */
  pointDataDifferenceMesh: Mesh

  /** Mesh with the differences between the cell data of the test mesh and the closest baseline. */
  cellDataDifferenceMesh: Mesh

}

export default CompareMeshesResult
