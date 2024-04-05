import {
  bufferToTypedArray,
  WorkerPoolFunctionOption,
  WorkerPoolFunctionResult,
  Image,
  Mesh,
  //    PolyData,
} from "itk-wasm";

import compressStringify from "./compress-stringify.js";
import parseStringDecompress from "./parse-string-decompress.js";

export interface ImageToJsonResult extends WorkerPoolFunctionResult {
  encoded: string;
}

export interface ImageToJsonOptions extends WorkerPoolFunctionOption {}

export async function imageToJson(
  image: Image,
  options: ImageToJsonOptions = {},
): Promise<ImageToJsonResult> {
  const level = 5;

  const encoded = new Image(image.imageType);
  encoded.origin = image.origin;
  encoded.spacing = image.spacing;
  encoded.size = image.size;
  encoded.metadata = image.metadata;

  const decoder = new TextDecoder("utf-8");
  const directionBytes = new Uint8Array(image.direction.buffer);
  // @ts-ignore
  const direction = await compressStringify(directionBytes, {
    compressionLevel: level,
    stringify: true,
    webWorker: options.webWorker,
    noCopy: options.noCopy,
  });
  const usedWebWorker = direction.webWorker;
  // @ts-ignore
  encoded.direction = decoder.decode(direction.output.buffer);

  if (image.data === null) {
    encoded.data = null;
  } else {
    const dataBytes = new Uint8Array(image.data.buffer);
    // @ts-ignore
    encoded.data = await compressStringify(dataBytes, {
      compressionLevel: level,
      stringify: true,
      webWorker: usedWebWorker,
      noCopy: options.noCopy,
    });
    // @ts-ignore
    encoded.data = decoder.decode(encoded.data.output.buffer);
  }

  const encodedJson = JSON.stringify(encoded);
  return { encoded: encodedJson, webWorker: usedWebWorker };
}

export interface JsonToImageResult extends WorkerPoolFunctionResult {
  decoded: Image;
}

export interface JsonToImageOptions extends WorkerPoolFunctionOption {}

export async function jsonToImage(
  encoded: string,
  options: JsonToImageOptions = {},
): Promise<JsonToImageResult> {
  const decoded = JSON.parse(encoded) as Image;

  const encoder = new TextEncoder();
  // @ts-ignore
  const directionBytes = new Uint8Array(encoder.encode(decoded.direction));
  // @ts-ignore
  const direction = await parseStringDecompress(directionBytes, {
    parseString: true,
    webWorker: options.webWorker,
    noCopy: true,
  });
  const usedWebWorker = direction.webWorker;
  // @ts-ignore
  decoded.direction = new Float64Array(direction.output.buffer);

  if (decoded.data === null) {
    decoded.data = null;
  } else {
    // @ts-ignore
    const dataBytes = new Uint8Array(encoder.encode(decoded.data));
    // @ts-ignore
    decoded.data = await parseStringDecompress(dataBytes, {
      parseString: true,
      webWorker: usedWebWorker,
      noCopy: true,
    });
    decoded.data = bufferToTypedArray(
      decoded.imageType.componentType,
      // @ts-ignore
      decoded.data.output.buffer,
    );
  }

  return { decoded, webWorker: usedWebWorker };
}

export interface MeshToJsonResult extends WorkerPoolFunctionResult {
  encoded: string;
}

export interface MeshToJsonOptions extends WorkerPoolFunctionOption {}

export async function meshToJson(
  mesh: Mesh,
  options: MeshToJsonOptions = {},
): Promise<MeshToJsonResult> {
  const level = 5;

  const encoded = new Mesh(mesh.meshType);
  encoded.name = mesh.name;
  encoded.numberOfPoints = mesh.numberOfPoints;
  encoded.numberOfCells = mesh.numberOfCells;
  encoded.numberOfPointPixels = mesh.numberOfPointPixels;
  encoded.numberOfCellPixels = mesh.numberOfCellPixels;
  encoded.cellBufferSize = mesh.cellBufferSize;

  let usedWebWorker = options.webWorker;
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
      const encodedProp = await compressStringify(dataBytes, {
        compressionLevel: level,
        stringify: true,
        webWorker: usedWebWorker,
        noCopy: options.noCopy,
      });
      usedWebWorker = encodedProp.webWorker;
      // @ts-ignore
      encoded[prop] = decoder.decode(encodedProp.output.buffer);
    }
  }

  const encodedJson = JSON.stringify(encoded);
  return { encoded: encodedJson, webWorker: usedWebWorker as Worker };
}

export interface JsonToMeshResult extends WorkerPoolFunctionResult {
  decoded: Mesh;
}

export interface JsonToMeshOptions extends WorkerPoolFunctionOption {}

export async function jsonToMesh(
  encoded: string,
  options: JsonToMeshOptions = {},
): Promise<JsonToMeshResult> {
  const decoded = JSON.parse(encoded) as Mesh;

  const componentTypeMap = new Map([
    ["points", "pointComponentType"],
    ["pointData", "pointPixelComponentType"],
    ["cells", "cellComponentType"],
    ["cellData", "cellPixelComponentType"],
  ]);

  const encoder = new TextEncoder();
  let usedWebWorker = options.webWorker;
  for (const prop of ["points", "pointData", "cells", "cellData"]) {
    // @ts-ignore: TS7053
    if (decoded[prop] === null) {
      // @ts-ignore: TS7053
      decoded[prop] = null;
    } else {
      // @ts-ignore: TS7053
      const dataBytes = new Uint8Array(encoder.encode(decoded[prop]));
      // @ts-ignore
      const decodedProp = await parseStringDecompress(dataBytes, {
        parseString: true,
        webWorker: usedWebWorker,
        noCopy: true,
      });
      usedWebWorker = decodedProp.webWorker;
      // @ts-ignore
      decoded[prop] = bufferToTypedArray(
        // @ts-ignore: TS7053
        decoded.meshType[componentTypeMap.get(prop)],
        decodedProp.output.buffer,
      );
    }
  }

  return { decoded, webWorker: usedWebWorker as Worker };
}
