// @ts-nocheck

import Mesh from '../interface-types/mesh.js'

import WriteArrayBufferResult from './write-array-buffer-result.js'
import WriteMeshOptions from './write-mesh-options.js'

/**
 * @deprecated Use writeMesh from @itk-wasm/mesh-io instead
 */
async function writeMeshArrayBuffer (webWorker: Worker | null, mesh: Mesh, fileName: string, mimeType: string, options: WriteMeshOptions): Promise<WriteArrayBufferResult> {
  throw new Error('writeMeshArrayBuffer is deprecated. Use writeMesh from @itk-wasm/mesh-io instead.')
}

export default writeMeshArrayBuffer
