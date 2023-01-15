interface CompressStringifyResult {
  /** WebWorker used for computation */
  webWorker: Worker | null

  /** Output compressed binary */
  output: Uint8Array

}

export default CompressStringifyResult
