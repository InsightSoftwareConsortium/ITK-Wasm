// @ts-nocheck

import WriteMeshOptions from './write-mesh-options.js'

import Mesh from '../interface-types/mesh.js'

/**
 * @deprecated Use writeMeshFileNode from @itk-wasm/mesh-io instead
 */
async function writeMeshLocalFile (mesh: Mesh, filePath: string, options: WriteMeshOptions): Promise<null> {
  throw new Error('writeMeshLocalFile is deprecated. Use writeMeshFileNode from @itk-wasm/mesh-io instead.')
}

export default writeMeshLocalFile
