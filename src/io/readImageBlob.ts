import { readAsArrayBuffer } from 'promise-file-reader'

import readImageArrayBuffer from './readImageArrayBuffer.js'
import ReadImageResult from './ReadImageResult.js'
import ReadImageArrayBufferOptions from './ReadImageArrayBufferOptions.js'

async function readImageBlob (webWorker: Worker | null, blob: Blob, fileName: string, options?: ReadImageArrayBufferOptions | string): Promise<ReadImageResult> {
  const arrayBuffer = await readAsArrayBuffer(blob)
  return await readImageArrayBuffer(webWorker, arrayBuffer, fileName, options)
}

export default readImageBlob
