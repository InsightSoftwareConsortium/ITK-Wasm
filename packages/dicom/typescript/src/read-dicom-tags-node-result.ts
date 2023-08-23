interface ReadDicomTagsNodeResult {
  /** Output tags in the file. JSON object an array of [tag, value] arrays. Values are encoded as UTF-8 strings. */
  tags: [string, string][]

}

export default ReadDicomTagsNodeResult
