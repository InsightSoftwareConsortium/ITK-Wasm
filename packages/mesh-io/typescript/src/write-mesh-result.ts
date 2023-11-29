import { BinaryFile } from 'itk-wasm'

interface WriteMeshResult {
  /** WebWorker used for computation */
  webWorker: Worker | null

  /** Output image serialized in the file format. */
  serializedMesh: BinaryFile
}

export default WriteMeshResult
