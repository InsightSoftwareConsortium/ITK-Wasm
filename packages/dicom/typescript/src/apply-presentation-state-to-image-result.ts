// Generated file. To retain edits, remove this comment.

import { JsonCompatible, Image, WorkerPoolFunctionResult } from 'itk-wasm'

interface ApplyPresentationStateToImageResult extends WorkerPoolFunctionResult {
  /** Output overlay information */
  presentationStateOutStream: JsonCompatible

  /** Output image */
  outputImage: Image

}

export default ApplyPresentationStateToImageResult
