import { Image } from 'itk-wasm'

interface ApplyPresentationStateToImageNodeResult {
  /** Output overlay information */
  presentationStateOutStream: string

  /** Output image */
  outputImage: Image

}

export default ApplyPresentationStateToImageNodeResult
