// Generated file. To retain edits, remove this comment.

import { WorkerPoolFunctionOption } from 'itk-wasm'

interface RepairOptions extends WorkerPoolFunctionOption {
  /** Point merging tolerance as a percent of the bounding box diagonal. */
  mergeTolerance?: number

  /** Minimum component area as a percent of the total area. Components smaller than this are removed. */
  minimumComponentArea?: number

  /** Maximum area of a hole as a percent of the total area. Holes smaller than this are filled. */
  maximumHoleArea?: number

  /** Maximum number of edges in a hole. Holes with fewer edges than this are filled. */
  maximumHoleEdges?: number

  /** Maximum distance as a percent of the bounding box diagonal. Vertices with degree 3 that are closer than this are merged. */
  maximumDegree3Distance?: number

  /** Remove intersecting triangles. */
  removeIntersectingTriangles?: boolean

}

export default RepairOptions
