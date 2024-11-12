import { WorkerPoolFunctionOption } from "itk-wasm";

interface WriteTransformOptions extends WorkerPoolFunctionOption {
  /** Use compression when writing the mesh if the IO formt supports it. */
  useCompression?: boolean;

  /** Use float for the parameter value type. The default is double. */
  floatParameters?: boolean;

  /** Mime type of the output mesh file. */
  mimeType?: string;
}

export default WriteTransformOptions;
