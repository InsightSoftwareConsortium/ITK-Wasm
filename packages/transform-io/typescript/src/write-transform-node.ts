import path from "path";

import { TransformList, getFileExtension } from "itk-wasm";

import mimeToTransformIo from "./mime-to-transform-io.js";
import extensionToTransformIo from "./extension-to-transform-io.js";
import transformIoIndexNode from "./transform-io-index-node.js";

import WriteTransformOptions from "./write-transform-options.js";

interface WriterOptions {
  useCompression?: boolean;
  floatParameters?: boolean;
}
interface WriterResult {
  couldWrite: boolean;
}
type Writer = (
  transform: TransformList,
  serializedTransform: string,
  options: WriterOptions
) => Promise<WriterResult>;

/**
 * Write a transform to a serialized file format and from an the itk-wasm Transform
 *
 * @param {Transform} transform - Input transform
 * @param {string} serializedTransform - Output transform serialized in the file format.
 * @param {WriteTransformOptions} options - options object
 *
 * @returns {void} - result object
 */
async function writeTransformNode(
  transform: TransformList,
  serializedTransform: string,
  options: WriteTransformOptions = {}
): Promise<void> {
  const absoluteFilePath = path.resolve(serializedTransform);
  const mimeType = options.mimeType;
  const extension = getFileExtension(absoluteFilePath);

  let inputTransform = transform;

  let io = null;
  if (typeof mimeType !== "undefined" && mimeToTransformIo.has(mimeType)) {
    io = mimeToTransformIo.get(mimeType);
  } else if (extensionToTransformIo.has(extension)) {
    io = extensionToTransformIo.get(extension);
  } else {
    for (const readerWriter of transformIoIndexNode.values()) {
      if (readerWriter[1] !== null) {
        let { couldWrite } = await (readerWriter[1] as Writer)(
          inputTransform,
          absoluteFilePath,
          {
            useCompression: options.useCompression,
            floatParameters: options.floatParameters,
          }
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
  const readerWriter = transformIoIndexNode.get(io as string);

  const writer = (readerWriter as Array<Writer>)[1];
  let { couldWrite } = await writer(inputTransform, absoluteFilePath, {
    useCompression: options.useCompression,
  });
  if (!couldWrite) {
    throw Error("Could not write: " + absoluteFilePath);
  }
}

export default writeTransformNode;
