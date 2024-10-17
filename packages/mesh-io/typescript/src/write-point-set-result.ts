import { BinaryFile } from "itk-wasm";

interface WritePointSetResult {
  /** WebWorker used for computation */
  webWorker: Worker | null;

  /** Output image serialized in the file format. */
  serializedPointSet: BinaryFile;
}

export default WritePointSetResult;
