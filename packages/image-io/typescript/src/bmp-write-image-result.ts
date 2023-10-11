// Generated file. To retain edits, remove this comment.

import { JsonCompatible, BinaryFile } from 'itk-wasm'

interface BmpWriteImageResult {
  /** WebWorker used for computation */
  webWorker: Worker | null

  /** Whether the input could be written. If false, the output image is not valid. */
  couldWrite: JsonCompatible

  /** Output image serialized in the file format. */
  serializedImage: BinaryFile

}

export default BmpWriteImageResult
