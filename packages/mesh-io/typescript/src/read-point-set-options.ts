import { WorkerPoolFunctionOption } from "itk-wasm";

interface ReadPointSetOptions extends WorkerPoolFunctionOption {
  /** Only read point set metadata -- do not read pixel data. */
  informationOnly?: boolean;
}

export default ReadPointSetOptions;
