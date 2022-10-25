import { Image } from 'itk-wasm'

interface ApplyPresentationStateToImageResult {
  /** WebWorker used for computation */
  webWorker: Worker | null

  /** Output overlay information */
  presentationStateOutStream: Object

  /** Output image */
  outputImage: Image

}

export default ApplyPresentationStateToImageResult
