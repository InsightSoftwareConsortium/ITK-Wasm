import { TransformList } from "itk-wasm";

interface ReadTransformResult {
  transform: TransformList;
  webWorker: Worker;
}

export default ReadTransformResult;
