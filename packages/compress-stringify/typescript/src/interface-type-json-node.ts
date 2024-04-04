import {
  bufferToTypedArray,
  Image,
  //    Mesh,
  //    PolyData,
} from "itk-wasm";

import compressStringifyNode from "./compress-stringify-node.js";
import parseStringDecompressNode from "./parse-string-decompress-node.js";

export interface ImageToJsonNodeResult {
  encoded: string;
}

export async function imageToJsonNode(
  image: Image,
): Promise<ImageToJsonNodeResult> {
  const level = 5;

  const encoded = new Image(image.imageType);
  encoded.origin = image.origin;
  encoded.spacing = image.spacing;
  encoded.size = image.size;
  encoded.metadata = image.metadata;

  const decoder = new TextDecoder("utf-8");
  const directionBytes = new Uint8Array(image.direction.buffer);
  // @ts-ignore
  encoded.direction = await compressStringifyNode(directionBytes, {
    compressionLevel: level,
    stringify: true,
  });
  // @ts-ignore
  encoded.direction = decoder.decode(encoded.direction.output.buffer);

  if (image.data === null) {
    encoded.data = null;
  } else {
    const dataBytes = new Uint8Array(image.data.buffer);
    // @ts-ignore
    encoded.data = await compressStringifyNode(dataBytes, {
      compressionLevel: level,
      stringify: true,
    });
    // @ts-ignore
    encoded.data = decoder.decode(encoded.data.output.buffer);
  }

  const encodedJson = JSON.stringify(encoded);
  return { encoded: encodedJson };
}

export interface JsonToImageNodeResult {
  decoded: Image;
}

export async function jsonToImageNode(
  encoded: string,
): Promise<JsonToImageNodeResult> {
  const decoded = JSON.parse(encoded) as Image;

  const encoder = new TextEncoder();
  // @ts-ignore
  const directionBytes = new Uint8Array(encoder.encode(decoded.direction));
  // @ts-ignore
  decoded.direction = await parseStringDecompressNode(directionBytes, {
    parseString: true,
  });
  // @ts-ignore
  decoded.direction = new Float64Array(decoded.direction.output.buffer);

  if (decoded.data === null) {
    decoded.data = null;
  } else {
    // @ts-ignore
    const dataBytes = new Uint8Array(encoder.encode(decoded.data));
    // @ts-ignore
    decoded.data = await parseStringDecompressNode(dataBytes, {
      parseString: true,
    });
    decoded.data = bufferToTypedArray(
      decoded.imageType.componentType,
      // @ts-ignore
      decoded.data.output.buffer,
    );
  }

  return { decoded };
}
