import { TransformList, BinaryFile, getFileExtension } from "itk-wasm";

import mimeToTransformIo from "./mime-to-transform-io.js";
import extensionToTransformIo from "./extension-to-transform-io.js";
import transformIoIndex from "./transform-io-index.js";
import WriteTransformOptions from "./write-transform-options.js";
import WriteTransformResult from "./write-transform-result.js";

interface WriterOptions {
  floatParameters?: boolean;
  useCompression?: boolean;
  /** WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. */
  webWorker?: Worker | null | boolean;
}
interface WriterResult {
  webWorker: Worker;
  couldWrite: boolean;
  serializedTransform: BinaryFile;
}
type Writer = (
  transform: TransformList,
  serializedTransform: string,
  options: WriterOptions
) => Promise<WriterResult>;

/**
 * Write an ITK-Wasm TransformList converted to an serialized transform file format
 *
 * @param {TransformList} transform - Input transform
 * @param {string} serializedTransform - Output transform serialized in the file format.
 * @param {WriteTransformOptions} options - options object
 *
 * @returns {Promise<WriteTransformResult>} - result object
 */
async function writeTransform(
  transform: TransformList,
  serializedTransform: string,
  options: WriteTransformOptions = {}
): Promise<WriteTransformResult> {
  let inputTransform = transform;

  const mimeType = options.mimeType;
  const extension = getFileExtension(serializedTransform).toLowerCase();
  let usedWebWorker = options.webWorker;

  let io = null;
  if (typeof mimeType !== "undefined" && mimeToTransformIo.has(mimeType)) {
    io = mimeToTransformIo.get(mimeType);
  } else if (extensionToTransformIo.has(extension)) {
    io = extensionToTransformIo.get(extension);
  } else {
    for (const readerWriter of transformIoIndex.values()) {
      if (readerWriter[1] !== null) {
        let {
          webWorker: testWebWorker,
          couldWrite,
          serializedTransform: serializedTransformBuffer,
        } = await (readerWriter[1] as unknown as Writer)(
          inputTransform,
          serializedTransform,
          options
        );
        usedWebWorker = testWebWorker;
        if (couldWrite) {
          return {
            webWorker: usedWebWorker as Worker,
            serializedTransform: serializedTransformBuffer,
          };
        }
      }
    }
  }
  if (!io) {
    throw Error("Could not find IO for: " + serializedTransform);
  }
  const readerWriter = transformIoIndex.get(io as string);

  const writer = (readerWriter as Array<Writer>)[1];
  let {
    webWorker: testWebWorker,
    couldWrite,
    serializedTransform: serializedTransformBuffer,
  } = await writer(inputTransform, serializedTransform, options);
  usedWebWorker = testWebWorker;
  if (!couldWrite) {
    throw Error("Could not write: " + serializedTransform);
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    serializedTransform: serializedTransformBuffer,
  };
  return result;
}

export default writeTransform;
