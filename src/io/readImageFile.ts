import { readAsArrayBuffer } from 'promise-file-reader'

import readImageArrayBuffer from './readImageArrayBuffer.js'
import ReadImageResult from './ReadImageResult.js'
import CastImageOptions from '../core/CastImageOptions.js'
import ReadImageArrayBufferOptions from './ReadImageArrayBufferOptions.js'

async function readImageFile (webWorker: Worker | null, file: File, options?: CastImageOptions): Promise<ReadImageResult> {
  const arrayBuffer = await readAsArrayBuffer(file)
  const optionsToPass: ReadImageArrayBufferOptions = typeof options === 'undefined' ? {} : { ...options }
  optionsToPass.mimeType = file.type
  return await readImageArrayBuffer(webWorker, arrayBuffer, file.name, optionsToPass)
}

export default readImageFile
