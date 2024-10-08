import {
  BinaryFile,
  PointSet,
  getFileExtension,
  WorkerPoolFunctionResult,
  WorkerPoolFunctionOption,
} from "itk-wasm";

import mimeToPointSetIo from "./mime-to-point-set-io.js";
import extensionToPointSetIo from "./extension-to-point-set-io.js";
import pointSetIoIndex from "./point-set-io-index.js";

import ReadPointSetOptions from "./read-point-set-options.js";
import ReadPointSetResult from "./read-point-set-result.js";

interface ReaderResult extends WorkerPoolFunctionResult {
  couldRead: boolean;
  pointSet: PointSet;
}
interface ReaderOptions extends WorkerPoolFunctionOption {
  /** Only read point set metadata -- do not read pixel data. */
  informationOnly?: boolean;
}
type Reader = (
  serializedPointSet: File | BinaryFile,
  options: ReaderOptions,
) => Promise<ReaderResult>;

/**
 * Read a point set file format and convert it to the itk-wasm file format
 *
 * @param {webWorker} null | webWorker - Web worker to run the pipeline or null to run it in a new worker
 * @param {File | BinaryFile} serializedPointSet - Input point set serialized in the file format
 * @param {ReadPointSetOptions} options - options to cast the resulting point set type or to only read point set metadata
 *
 * @returns {Promise<ReadPointSetResult>} - result object with the point set and the web worker used
 */
async function readPointSet(
  serializedPointSet: File | BinaryFile,
  options: ReadPointSetOptions = {},
): Promise<ReadPointSetResult> {
  const mimeType = (serializedPointSet as File).type ?? "";
  const fileName =
    (serializedPointSet as File).name ??
    (serializedPointSet as BinaryFile).path ??
    "fileName";
  const extension = getFileExtension(fileName).toLowerCase();
  let usedWebWorker = options?.webWorker;

  let serializedPointSetFile = serializedPointSet as BinaryFile;
  if (serializedPointSet instanceof Blob) {
    const serializedPointSetBuffer = await serializedPointSet.arrayBuffer();
    serializedPointSetFile = {
      path: serializedPointSet.name,
      data: new Uint8Array(serializedPointSetBuffer),
    };
  }

  let io = null;
  if (mimeType && mimeToPointSetIo.has(mimeType)) {
    io = mimeToPointSetIo.get(mimeType);
  } else if (extensionToPointSetIo.has(extension)) {
    io = extensionToPointSetIo.get(extension);
  } else {
    for (const readerWriter of pointSetIoIndex.values()) {
      if (readerWriter[0] !== null) {
        let {
          webWorker: testWebWorker,
          couldRead,
          pointSet,
        } = await (readerWriter[0] as unknown as Reader)(
          {
            path: serializedPointSetFile.path,
            data: serializedPointSetFile.data.slice(),
          },
          {
            informationOnly: options.informationOnly,
            webWorker: usedWebWorker,
            noCopy: options?.noCopy,
          },
        );
        usedWebWorker = testWebWorker;
        if (couldRead) {
          return { webWorker: usedWebWorker, pointSet };
        }
      }
    }
  }
  if (!io) {
    throw Error("Could not find IO for: " + fileName);
  }
  const readerWriter = pointSetIoIndex.get(io as string);

  const reader = (readerWriter as Array<Reader>)[0];
  let {
    webWorker: testWebWorker,
    couldRead,
    pointSet,
  } = await reader(serializedPointSetFile, {
    informationOnly: options.informationOnly,
    webWorker: usedWebWorker,
    noCopy: options?.noCopy,
  });
  usedWebWorker = testWebWorker;
  if (!couldRead) {
    throw Error("Could not read: " + fileName);
  }

  return { webWorker: usedWebWorker, pointSet };
}

export default readPointSet;
