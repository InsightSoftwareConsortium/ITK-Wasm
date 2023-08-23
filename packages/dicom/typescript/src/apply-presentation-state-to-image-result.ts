// Generated file. To retain edits, remove this comment.

import { JsonCompatible, Image } from 'itk-wasm'

interface ApplyPresentationStateToImageResult {
  /** WebWorker used for computation */
  webWorker: Worker | null

  /** Output overlay information */
  presentationStateOutStream: JsonCompatible

  /** Output image */
  outputImage: Image

}

export default ApplyPresentationStateToImageResult
