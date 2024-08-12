// @ts-nocheck

import WriteMeshOptions from './write-mesh-options.js'

import Mesh from '../interface-types/mesh.js'

/**
 * @deprecated Use writeMeshNode from @itk-wasm/mesh-io instead
 */
async function writeMeshLocalFile (mesh: Mesh, filePath: string, options: WriteMeshOptions): Promise<null> {
  throw new Error('writeMeshLocalFile is deprecated. Use writeMeshNode from @itk-wasm/mesh-io instead.')
}

export default writeMeshLocalFile
