interface ReadDICOMTagsResult {
  webWorker: Worker

  tags: Array<[string, string]>
}

export default ReadDICOMTagsResult
