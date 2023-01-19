interface ParseStringDecompressResult {
  /** WebWorker used for computation */
  webWorker: Worker | null

  /** Output decompressed binary */
  output: Uint8Array

}

export default ParseStringDecompressResult
