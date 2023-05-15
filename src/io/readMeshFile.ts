import readMeshArrayBuffer from './readMeshArrayBuffer.js'
import ReadMeshResult from './ReadMeshResult.js'

async function readMeshFile (webWorker: Worker | null, file: File): Promise<ReadMeshResult> {
  const arrayBuffer = await file.arrayBuffer()
  return await readMeshArrayBuffer(webWorker, arrayBuffer, file.name, file.type)
}

export default readMeshFile
