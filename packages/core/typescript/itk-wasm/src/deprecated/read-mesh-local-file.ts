// @ts-nocheck

import Mesh from '../interface-types/mesh.js'

/**
 * @deprecated Use readMeshNode from @itk-wasm/mesh-io instead
 */
async function readMeshLocalFile (filePath: string): Promise<Mesh> {
  throw new Error('readMeshLocalFile is deprecated. Use readMeshNode from @itk-wasm/mesh-io instead.')
}

export default readMeshLocalFile
