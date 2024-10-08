import { PointSet, BinaryFile, getFileExtension } from "itk-wasm";

import mimeToPointSetIo from "./mime-to-point-set-io.js";
import extensionToPointSetIo from "./extension-to-point-set-io.js";
import pointSetIoIndex from "./point-set-io-index.js";
import WritePointSetOptions from "./write-point-set-options.js";
import WritePointSetResult from "./write-point-set-result.js";

interface WriterOptions {
  informationOnly?: boolean;
  useCompression?: boolean;
  /** WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. */
  webWorker?: Worker | null | boolean;
}
interface WriterResult {
  webWorker: Worker;
  couldWrite: boolean;
  serializedPointSet: BinaryFile;
}
type Writer = (
  pointSet: PointSet,
  serializedPointSet: string,
  options: WriterOptions,
) => Promise<WriterResult>;

/**
 * Write an itk-wasm PointSet converted to an serialized point set file format
 *
 * @param {PointSet} pointSet - Input point set
 * @param {string} serializedPointSet - Output point set serialized in the file format.
 * @param {WritePointSetOptions} options - options object
 *
 * @returns {Promise<WritePointSetResult>} - result object
 */
async function writePointSet(
  pointSet: PointSet,
  serializedPointSet: string,
  options: WritePointSetOptions = {},
): Promise<WritePointSetResult> {
  let inputPointSet = pointSet;

  const mimeType = options.mimeType;
  const extension = getFileExtension(serializedPointSet).toLowerCase();
  let usedWebWorker = options.webWorker;

  let io = null;
  if (typeof mimeType !== "undefined" && mimeToPointSetIo.has(mimeType)) {
    io = mimeToPointSetIo.get(mimeType);
  } else if (extensionToPointSetIo.has(extension)) {
    io = extensionToPointSetIo.get(extension);
  } else {
    for (const readerWriter of pointSetIoIndex.values()) {
      if (readerWriter[1] !== null) {
        let {
          webWorker: testWebWorker,
          couldWrite,
          serializedPointSet: serializedPointSetBuffer,
        } = await (readerWriter[1] as unknown as Writer)(
          inputPointSet,
          serializedPointSet,
          options,
        );
        usedWebWorker = testWebWorker;
        if (couldWrite) {
          return {
            webWorker: usedWebWorker as Worker,
            serializedPointSet: serializedPointSetBuffer,
          };
        }
      }
    }
  }
  if (!io) {
    throw Error("Could not find IO for: " + serializedPointSet);
  }
  const readerWriter = pointSetIoIndex.get(io as string);

  const writer = (readerWriter as Array<Writer>)[1];
  let {
    webWorker: testWebWorker,
    couldWrite,
    serializedPointSet: serializedPointSetBuffer,
  } = await writer(inputPointSet, serializedPointSet, options);
  usedWebWorker = testWebWorker;
  if (!couldWrite) {
    throw Error("Could not write: " + serializedPointSet);
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    serializedPointSet: serializedPointSetBuffer,
  };
  return result;
}

export default writePointSet;
