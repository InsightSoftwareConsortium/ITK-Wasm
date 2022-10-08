import { Image } from 'itk-wasm'

interface ApplyPresentationStateToImageResult {
  /** WebWorker used for computation */
  webWorker: Worker | null

  /** Output overlay information */
  presentationStateOutStream: string

  /** Output image */
  outputImage: Image

}

export default ApplyPresentationStateToImageResult
