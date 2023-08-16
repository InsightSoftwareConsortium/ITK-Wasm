interface ReadDicomTagsResult {
  /** WebWorker used for computation */
  webWorker: Worker | null

  /** Output tags in the file. JSON object an array of [tag, value] arrays. Values are encoded as UTF-8 strings. */
  tags: Array<[string, string]>
}

export default ReadDicomTagsResult
