import path from "path";
import mime from "mime-types";

import { TransformList, getFileExtension } from "itk-wasm";

import mimeToTransformIo from "./mime-to-transform-io.js";
import extensionToTransformIo from "./extension-to-transform-io.js";
import transformIoIndexNode from "./transform-io-index-node.js";

import ReadTransformOptions from "./read-transform-options.js";

interface ReaderResult {
  couldRead: boolean;
  transform: TransformList;
}
interface ReaderOptions {
  /** Use float for the parameters value type. The default is double. */
  floatParameters?: boolean;
}
type Reader = (
  serializedTransform: string,
  options: ReaderOptions
) => Promise<ReaderResult>;

/**
 * Read a transform file format and convert it to the ITK-Wasm file format
 *
 * @param {string} serializedTransform - Path to input transform serialized in the file format
 * @param {ReadTransformOptions} options - options to set the transform parameters type
 *
 * @returns {Promise<TransformList>} - TransformList result
 */
async function readTransformNode(
  serializedTransform: string,
  options: ReadTransformOptions = {}
): Promise<TransformList> {
  const absoluteFilePath = path.resolve(serializedTransform);
  const mimeType = mime.lookup(absoluteFilePath);
  const extension = getFileExtension(absoluteFilePath);

  let io = null;
  if (mimeType && mimeToTransformIo.has(mimeType)) {
    io = mimeToTransformIo.get(mimeType);
  } else if (extensionToTransformIo.has(extension)) {
    io = extensionToTransformIo.get(extension);
  } else {
    for (const readerWriter of transformIoIndexNode.values()) {
      if (readerWriter[0] !== null) {
        let { couldRead, transform } = await (readerWriter[0] as Reader)(
          absoluteFilePath,
          { floatParameters: options.floatParameters }
        );
        if (couldRead) {
          return transform;
        }
      }
    }
  }
  if (io === null) {
    throw Error("Could not find IO for: " + absoluteFilePath);
  }
  const readerWriter = transformIoIndexNode.get(io as string);

  const reader = (readerWriter as Array<Reader>)[0];
  let { couldRead, transform } = await reader(absoluteFilePath, {
    floatParameters: options.floatParameters,
  });
  if (!couldRead) {
    throw Error("Could not read: " + absoluteFilePath);
  }

  return transform;
}

export default readTransformNode;
