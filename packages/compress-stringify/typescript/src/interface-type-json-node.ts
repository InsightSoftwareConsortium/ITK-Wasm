import {
  bufferToTypedArray,
  Image,
  Mesh,
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

export interface MeshToJsonNodeResult {
  encoded: string;
}

export async function meshToJsonNode(
  mesh: Mesh,
): Promise<MeshToJsonNodeResult> {
  const level = 5;

  const encoded = new Mesh(mesh.meshType);
  encoded.name = mesh.name;
  encoded.numberOfPoints = mesh.numberOfPoints;
  encoded.numberOfCells = mesh.numberOfCells;
  encoded.numberOfPointPixels = mesh.numberOfPointPixels;
  encoded.numberOfCellPixels = mesh.numberOfCellPixels;
  encoded.cellBufferSize = mesh.cellBufferSize;

  const decoder = new TextDecoder("utf-8");
  for (const prop of ["points", "pointData", "cells", "cellData"]) {
    // @ts-ignore: TS7053
    if (mesh[prop] === null) {
      // @ts-ignore: TS7053
      encoded[prop] = null;
    } else {
      // @ts-ignore: TS7053
      const dataBytes = new Uint8Array(mesh[prop].buffer);
      // @ts-ignore
      const encodedProp = await compressStringifyNode(dataBytes, {
        compressionLevel: level,
        stringify: true,
      });
      // @ts-ignore
      encoded[prop] = decoder.decode(encodedProp.output.buffer);
    }
  }

  const encodedJson = JSON.stringify(encoded);
  return { encoded: encodedJson };
}

export interface JsonToMeshNodeResult {
  decoded: Mesh;
}

export async function jsonToMeshNode(
  encoded: string,
): Promise<JsonToMeshNodeResult> {
  const decoded = JSON.parse(encoded) as Mesh;

  const componentTypeMap = new Map([
    ["points", "pointComponentType"],
    ["pointData", "pointPixelComponentType"],
    ["cells", "cellComponentType"],
    ["cellData", "cellPixelComponentType"],
  ]);

  const encoder = new TextEncoder();
  for (const prop of ["points", "pointData", "cells", "cellData"]) {
    // @ts-ignore: TS7053
    if (decoded[prop] === null) {
      // @ts-ignore: TS7053
      decoded[prop] = null;
    } else {
      // @ts-ignore: TS7053
      const dataBytes = new Uint8Array(encoder.encode(decoded[prop]));
      // @ts-ignore
      const decodedProp = await parseStringDecompressNode(dataBytes, {
        parseString: true,
      });
      // @ts-ignore
      decoded[prop] = bufferToTypedArray(
        // @ts-ignore: TS7053
        decoded.meshType[componentTypeMap.get(prop)],
        decodedProp.output.buffer,
      );
    }
  }

  return { decoded };
}
