// @ts-nocheck

import Mesh from '../interface-types/mesh.js'
import PolyData from '../interface-types/poly-data.js'

/**
 * @deprecated Use polyDataToMesh from @itk-wasm/mesh-to-poly-data instead
 */
async function polyDataToMesh (webWorker: Worker | null, polyData: PolyData): Promise<{ mesh: Mesh, webWorker: Worker }> {
  throw new Error('This function has been migrated to the @itk-wasm/mesh-to-poly-data package.')
}

export default polyDataToMesh
