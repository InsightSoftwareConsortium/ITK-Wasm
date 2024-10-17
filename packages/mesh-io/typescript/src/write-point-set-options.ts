import { WorkerPoolFunctionOption } from "itk-wasm";

interface WritePointSetOptions extends WorkerPoolFunctionOption {
  /** Use compression when writing the point set if the IO formt supports it. */
  useCompression?: boolean;

  /** Use a binary file type in the written file, if supported */
  binaryFileType?: boolean;

  /** Mime type of the output point set file. */
  mimeType?: string;

  /** Only write the point set information, not the pixel data. */
  informationOnly?: boolean;
}

export default WritePointSetOptions;
