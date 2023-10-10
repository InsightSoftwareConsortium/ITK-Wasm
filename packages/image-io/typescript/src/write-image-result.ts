import { BinaryFile } from 'itk-wasm'

interface WriteImageResult {
  /** WebWorker used for computation */
  webWorker: Worker | null

  /** Output image serialized in the file format. */
  serializedImage: BinaryFile
}

export default WriteImageResult
