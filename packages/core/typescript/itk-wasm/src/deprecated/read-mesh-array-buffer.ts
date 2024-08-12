// @ts-nocheck

import ReadMeshResult from './read-mesh-result.js'

/**
 * @deprecated Use readMeshArrayBuffer from @itk-wasm/image-io instead
 */
async function readMeshArrayBuffer (webWorker: Worker | null, arrayBuffer: ArrayBuffer, fileName: string, mimeType: string): Promise<ReadMeshResult> {
  throw new Error('readMeshArrayBuffer is deprecated. Use readMesh from @itk-wasm/mesh-io instead.')
}

export default readMeshArrayBuffer
