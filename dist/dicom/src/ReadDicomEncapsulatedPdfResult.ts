interface ReadDicomEncapsulatedPdfResult {
  /** WebWorker used for computation */
  webWorker: Worker | null

  /** Output pdf file */
  pdfBinaryOutput: Uint8Array

}

export default ReadDicomEncapsulatedPdfResult
