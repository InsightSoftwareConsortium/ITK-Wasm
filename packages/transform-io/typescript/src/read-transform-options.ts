import { WorkerPoolFunctionOption } from "itk-wasm";

interface ReadTransformOptions extends WorkerPoolFunctionOption {
  /** Use float for the parameters value type. The default is double. */
  floatParameters?: boolean;
}

export default ReadTransformOptions;
