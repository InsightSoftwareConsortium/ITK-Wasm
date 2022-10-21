interface CastImageResult {
  /** WebWorker used for computation */
  webWorker: Worker | null

  /** The output image */
  outputImage: Image

}

export default CastImageResult
