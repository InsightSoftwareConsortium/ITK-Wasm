import { BinaryFile } from "itk-wasm";

interface WriteTransformResult {
  /** WebWorker used for computation */
  webWorker: Worker | null;

  /** Output image serialized in the file format. */
  serializedTransform: BinaryFile;
}

export default WriteTransformResult;
