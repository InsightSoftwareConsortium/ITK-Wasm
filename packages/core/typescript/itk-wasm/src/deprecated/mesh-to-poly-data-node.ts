// @ts-nocheck

import Mesh from '../interface-types/mesh.js'
import PolyData from '../interface-types/poly-data.js'

/**
 * @deprecated Use meshToPolyDataNode from @itk-wasm/mesh-to-poly-data instead
 */
async function meshToPolyDataNode (mesh: Mesh): Promise<PolyData> {
  throw new Error('This function has been migrated to the @itk-wasm/mesh-to-poly-data package.')
}

export default meshToPolyDataNode
