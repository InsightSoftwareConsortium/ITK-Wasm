interface Ge5WriteImageNodeResult {
  /** Whether the input could be written. If false, the output image is not valid. */
  couldWrite: boolean

  /** Output image serialized in the file format. */
  serializedImage: string

}

export default Ge5WriteImageNodeResult
