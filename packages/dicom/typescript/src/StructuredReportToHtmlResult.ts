interface StructuredReportToHtmlResult {
  /** WebWorker used for computation */
  webWorker: Worker | null

  /** Output text file */
  outputText: string

}

export default StructuredReportToHtmlResult
