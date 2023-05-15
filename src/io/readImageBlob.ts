import readImageArrayBuffer from './readImageArrayBuffer.js'
import ReadImageResult from './ReadImageResult.js'
import ReadImageArrayBufferOptions from './ReadImageArrayBufferOptions.js'

async function readImageBlob (webWorker: Worker | null, blob: Blob, fileName: string, options?: ReadImageArrayBufferOptions | string): Promise<ReadImageResult> {
  const arrayBuffer = await blob.arrayBuffer()
  return await readImageArrayBuffer(webWorker, arrayBuffer, fileName, options)
}

export default readImageBlob
