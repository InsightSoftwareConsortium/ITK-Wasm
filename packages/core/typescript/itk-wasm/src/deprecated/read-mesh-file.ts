// @ts-nocheck

import ReadMeshResult from './read-mesh-result.js'

/**
 * @deprecated Use readMesh from @itk-wasm/mesh-io instead
 */
async function readMeshFile (webWorker: Worker | null, file: File): Promise<ReadMeshResult> {
  throw new Error('readMeshFile is deprecated. Use readMesh from @itk-wasm/mesh-io instead.')
}

export default readMeshFile
