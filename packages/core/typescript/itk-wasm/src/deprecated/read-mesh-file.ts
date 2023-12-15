// @ts-nocheck

import ReadMeshResult from './read-mesh-result.js'

/**
 * @deprecated Use readMeshFile from @itk-wasm/mesh-io instead
 */
async function readMeshFile (webWorker: Worker | null, file: File): Promise<ReadMeshResult> {
  throw new Error('readMeshFile is deprecated. Use readMeshFile from @itk-wasm/mesh-io instead.')
}

export default readMeshFile
