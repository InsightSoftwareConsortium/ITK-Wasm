// @ts-nocheck

import ReadMeshResult from './read-mesh-result.js'

/**
 * @deprecated Use readMeshBlob from @itk-wasm/mesh-io instead
 */
async function readMeshBlob (webWorker: Worker | null, blob: Blob, fileName: string, mimeType: string): Promise<ReadMeshResult> {
  throw new Error('readMeshBlob is deprecated. Use readMesh from @itk-wasm/mesh-io instead.')
}

export default readMeshBlob
