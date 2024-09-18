import { PointSet } from "itk-wasm";

interface ReadPointSetResult {
  pointSet: PointSet;
  webWorker: Worker;
}

export default ReadPointSetResult;
