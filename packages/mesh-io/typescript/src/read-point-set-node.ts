import path from "path";
import mime from "mime-types";

import { PointSet, getFileExtension } from "itk-wasm";

import mimeToPointSetIo from "./mime-to-point-set-io.js";
import extensionToPointSetIo from "./extension-to-point-set-io.js";
import pointSetIoIndexNode from "./point-set-io-index-node.js";

import ReadPointSetOptions from "./read-point-set-options.js";

interface ReaderResult {
  couldRead: boolean;
  pointSet: PointSet;
}
interface ReaderOptions {
  /** Only read image metadata -- do not read pixel data. */
  informationOnly?: boolean;
}
type Reader = (
  serializedPointSet: string,
  options: ReaderOptions,
) => Promise<ReaderResult>;

/**
 * Read a pointSet file format and convert it to the itk-wasm file format
 *
 * @param {string} serializedPointSet - Path to input pointSet serialized in the file format
 * @param {ReadPointSetOptions} options - options to cast resulting pointSet type or to only read pointSet metadata
 *
 * @returns {Promise<PointSet>} - PointSet result
 */
async function readPointSetNode(
  serializedPointSet: string,
  options: ReadPointSetOptions = {},
): Promise<PointSet> {
  const absoluteFilePath = path.resolve(serializedPointSet);
  const mimeType = mime.lookup(absoluteFilePath);
  const extension = getFileExtension(absoluteFilePath);

  let io = null;
  if (mimeType && mimeToPointSetIo.has(mimeType)) {
    io = mimeToPointSetIo.get(mimeType);
  } else if (extensionToPointSetIo.has(extension)) {
    io = extensionToPointSetIo.get(extension);
  } else {
    for (const readerWriter of pointSetIoIndexNode.values()) {
      if (readerWriter[0] !== null) {
        let { couldRead, pointSet } = await (readerWriter[0] as Reader)(
          absoluteFilePath,
          { informationOnly: options.informationOnly },
        );
        if (couldRead) {
          return pointSet;
        }
      }
    }
  }
  if (io === null) {
    throw Error("Could not find IO for: " + absoluteFilePath);
  }
  const readerWriter = pointSetIoIndexNode.get(io as string);

  const reader = (readerWriter as Array<Reader>)[0];
  let { couldRead, pointSet } = await reader(absoluteFilePath, {
    informationOnly: options.informationOnly,
  });
  if (!couldRead) {
    throw Error("Could not read: " + absoluteFilePath);
  }

  return pointSet;
}

export default readPointSetNode;
