import { BinaryFile, WorkerPoolFunctionResult } from 'itk-wasm'

interface WriteImageResult extends WorkerPoolFunctionResult {
  /** Output image serialized in the file format. */
  serializedImage: BinaryFile
}

export default WriteImageResult
