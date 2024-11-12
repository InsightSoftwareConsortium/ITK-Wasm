import {
  BinaryFile,
  TransformList,
  getFileExtension,
  WorkerPoolFunctionResult,
  WorkerPoolFunctionOption,
} from "itk-wasm";

import mimeToTransformIo from "./mime-to-transform-io.js";
import extensionToTransformIo from "./extension-to-transform-io.js";
import transformIoIndex from "./transform-io-index.js";

import ReadTransformOptions from "./read-transform-options.js";
import ReadTransformResult from "./read-transform-result.js";

interface ReaderResult extends WorkerPoolFunctionResult {
  couldRead: boolean;
  transform: TransformList;
}
interface ReaderOptions extends WorkerPoolFunctionOption {
  /** Use float for the parameters value type. The default is double. */
  floatParameters?: boolean;
}
type Reader = (
  serializedTransform: File | BinaryFile,
  options: ReaderOptions
) => Promise<ReaderResult>;

/**
 * Read a transform file format and convert it to the ITK-Wasm file format
 *
 * @param {webWorker} null | webWorker - Web worker to run the pipeline or null to run it in a new worker
 * @param {File | BinaryFile} serializedTransform - Input transform serialized in the file format
 * @param {ReadTransformOptions} options - options to cast the resulting transform type or to only read transform metadata
 *
 * @returns {Promise<ReadTransformResult>} - result object with the transform and the web worker used
 */
async function readTransform(
  serializedTransform: File | BinaryFile,
  options: ReadTransformOptions = {}
): Promise<ReadTransformResult> {
  const mimeType = (serializedTransform as File).type ?? "";
  const fileName =
    (serializedTransform as File).name ??
    (serializedTransform as BinaryFile).path ??
    "fileName";
  const extension = getFileExtension(fileName).toLowerCase();
  let usedWebWorker = options?.webWorker;

  let serializedTransformFile = serializedTransform as BinaryFile;
  if (serializedTransform instanceof Blob) {
    const serializedTransformBuffer = await serializedTransform.arrayBuffer();
    serializedTransformFile = {
      path: serializedTransform.name,
      data: new Uint8Array(serializedTransformBuffer),
    };
  }

  let io = null;
  if (mimeType && mimeToTransformIo.has(mimeType)) {
    io = mimeToTransformIo.get(mimeType);
  } else if (extensionToTransformIo.has(extension)) {
    io = extensionToTransformIo.get(extension);
  } else {
    for (const readerWriter of transformIoIndex.values()) {
      if (readerWriter[0] !== null) {
        let {
          webWorker: testWebWorker,
          couldRead,
          transform,
        } = await (readerWriter[0] as unknown as Reader)(
          {
            path: serializedTransformFile.path,
            data: serializedTransformFile.data.slice(),
          },
          {
            floatParameters: options.floatParameters,
            webWorker: usedWebWorker,
            noCopy: options?.noCopy,
          }
        );
        usedWebWorker = testWebWorker;
        if (couldRead) {
          return { webWorker: usedWebWorker, transform };
        }
      }
    }
  }
  if (!io) {
    throw Error("Could not find IO for: " + fileName);
  }
  const readerWriter = transformIoIndex.get(io as string);

  const reader = (readerWriter as Array<Reader>)[0];
  let {
    webWorker: testWebWorker,
    couldRead,
    transform,
  } = await reader(serializedTransformFile, {
    floatParameters: options.floatParameters,
    webWorker: usedWebWorker,
    noCopy: options?.noCopy,
  });
  usedWebWorker = testWebWorker;
  if (!couldRead) {
    throw Error("Could not read: " + fileName);
  }

  return { webWorker: usedWebWorker, transform };
}

export default readTransform;
