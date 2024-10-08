import path from "path";

import { PointSet, getFileExtension } from "itk-wasm";

import mimeToPointSetIo from "./mime-to-point-set-io.js";
import extensionToPointSetIo from "./extension-to-point-set-io.js";
import pointSetIoIndexNode from "./point-set-io-index-node.js";

import WritePointSetOptions from "./write-point-set-options.js";

interface WriterOptions {
  useCompression?: boolean;
  binaryFileType?: boolean;
}
interface WriterResult {
  couldWrite: boolean;
}
type Writer = (
  pointSet: PointSet,
  serializedImage: string,
  options: WriterOptions,
) => Promise<WriterResult>;

/**
 * Write a point set to a serialized file format and from an the itk-wasm PointSet
 *
 * @param {PointSet} point set - Input point set
 * @param {string} serializedPointSet - Output point set serialized in the file format.
 * @param {WritePointSetOptions} options - options object
 *
 * @returns {void} - result object
 */
async function writePointSetNode(
  pointSet: PointSet,
  serializedPointSet: string,
  options: WritePointSetOptions = {},
): Promise<void> {
  const absoluteFilePath = path.resolve(serializedPointSet);
  const mimeType = options.mimeType;
  const extension = getFileExtension(absoluteFilePath);

  let inputPointSet = pointSet;

  let io = null;
  if (typeof mimeType !== "undefined" && mimeToPointSetIo.has(mimeType)) {
    io = mimeToPointSetIo.get(mimeType);
  } else if (extensionToPointSetIo.has(extension)) {
    io = extensionToPointSetIo.get(extension);
  } else {
    for (const readerWriter of pointSetIoIndexNode.values()) {
      if (readerWriter[1] !== null) {
        let { couldWrite } = await (readerWriter[1] as Writer)(
          inputPointSet,
          absoluteFilePath,
          {
            useCompression: options.useCompression,
            binaryFileType: options.binaryFileType,
          },
        );
        if (couldWrite) {
          return;
        }
      }
    }
  }
  if (io === null) {
    throw Error("Could not find IO for: " + absoluteFilePath);
  }
  const readerWriter = pointSetIoIndexNode.get(io as string);

  const writer = (readerWriter as Array<Writer>)[1];
  let { couldWrite } = await writer(inputPointSet, absoluteFilePath, {
    useCompression: options.useCompression,
  });
  if (!couldWrite) {
    throw Error("Could not write: " + absoluteFilePath);
  }
}

export default writePointSetNode;
