// @ts-nocheck

import Mesh from '../interface-types/mesh.js'
import PolyData from '../interface-types/poly-data.js'

/**
 * @deprecated Use meshToPolyData from @itk-wasm/mesh-to-poly-data instead
 */
async function meshToPolyData (webWorker: Worker | null, mesh: Mesh): Promise<{ polyData: PolyData, webWorker: Worker }> {
  throw new Error('This function has been migrated to the @itk-wasm/mesh-to-poly-data package.')
}

export default meshToPolyData
