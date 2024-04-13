import {
  bufferToTypedArray,
  WorkerPoolFunctionOption,
  WorkerPoolFunctionResult,
  Image,
  Mesh,
  PolyData,
} from "itk-wasm";

import compressStringify from "./compress-stringify.js";
import parseStringDecompress from "./parse-string-decompress.js";

import {
  ImageJson,
  MeshJson,
  PolyDataJson,
} from "./interface-type-json-common.js";

export interface ImageToJsonResult extends WorkerPoolFunctionResult {
  encoded: ImageJson;
}

export interface ImageToJsonOptions extends WorkerPoolFunctionOption {}

export async function imageToJson(
  image: Image,
  options: ImageToJsonOptions = {},
): Promise<ImageToJsonResult> {
  const level = 5;

  const encoded = new Image(image.imageType) as unknown as ImageJson;
  encoded.origin = image.origin;
  encoded.spacing = image.spacing;
  encoded.size = image.size;
  encoded.metadata = image.metadata;

  const decoder = new TextDecoder("utf-8");
  const directionBytes = new Uint8Array(image.direction.buffer);
  const direction = await compressStringify(directionBytes, {
    compressionLevel: level,
    stringify: true,
    webWorker: options.webWorker,
    noCopy: options.noCopy,
  });
  const usedWebWorker = direction.webWorker;
  encoded.direction = decoder.decode(direction.output.buffer);

  if (image.data === null) {
    encoded.data = null;
  } else {
    const dataBytes = new Uint8Array(image.data.buffer);
    const encodedData = await compressStringify(dataBytes, {
      compressionLevel: level,
      stringify: true,
      webWorker: usedWebWorker,
      noCopy: options.noCopy,
    });
    encoded.data = decoder.decode(encodedData.output.buffer);
  }

  return { encoded, webWorker: usedWebWorker };
}

export interface JsonToImageResult extends WorkerPoolFunctionResult {
  decoded: Image;
}

export interface JsonToImageOptions extends WorkerPoolFunctionOption {}

export async function jsonToImage(
  encoded: ImageJson,
  options: JsonToImageOptions = {},
): Promise<JsonToImageResult> {
  const decoded = encoded as unknown as Image;

  const encoder = new TextEncoder();
  const directionBytes = new Uint8Array(encoder.encode(encoded.direction));
  const direction = await parseStringDecompress(directionBytes, {
    parseString: true,
    webWorker: options.webWorker,
    noCopy: true,
  });
  const usedWebWorker = direction.webWorker;
  decoded.direction = new Float64Array(direction.output.buffer);

  if (!decoded.data) {
    decoded.data = null;
  } else {
    const dataBytes = new Uint8Array(encoder.encode(encoded.data as string));
    const decodedData = await parseStringDecompress(dataBytes, {
      parseString: true,
      webWorker: usedWebWorker,
      noCopy: true,
    });
    decoded.data = bufferToTypedArray(
      decoded.imageType.componentType,
      decodedData.output.buffer,
    );
  }

  return { decoded, webWorker: usedWebWorker };
}

export interface MeshToJsonResult extends WorkerPoolFunctionResult {
  encoded: MeshJson;
}

export interface MeshToJsonOptions extends WorkerPoolFunctionOption {}

export async function meshToJson(
  mesh: Mesh,
  options: MeshToJsonOptions = {},
): Promise<MeshToJsonResult> {
  const level = 5;

  const encoded = new Mesh(mesh.meshType) as unknown as MeshJson;
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

  return { encoded, webWorker: usedWebWorker as Worker };
}

export interface JsonToMeshResult extends WorkerPoolFunctionResult {
  decoded: Mesh;
}

export interface JsonToMeshOptions extends WorkerPoolFunctionOption {}

export async function jsonToMesh(
  encoded: MeshJson,
  options: JsonToMeshOptions = {},
): Promise<JsonToMeshResult> {
  // @ts-ignore: TS7053
  const decoded = encoded as Mesh;

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

export interface PolyDataToJsonResult extends WorkerPoolFunctionResult {
  encoded: PolyDataJson;
}

export interface PolyDataToJsonOptions extends WorkerPoolFunctionOption {}

export async function polyDataToJson(
  polyData: PolyData,
  options: PolyDataToJsonOptions = {},
): Promise<PolyDataToJsonResult> {
  const level = 5;

  const encoded = new PolyData(
    polyData.polyDataType,
  ) as unknown as PolyDataJson;
  encoded.name = polyData.name;
  encoded.numberOfPoints = polyData.numberOfPoints;
  encoded.verticesBufferSize = polyData.verticesBufferSize;
  encoded.linesBufferSize = polyData.linesBufferSize;
  encoded.polygonsBufferSize = polyData.polygonsBufferSize;
  encoded.triangleStripsBufferSize = polyData.triangleStripsBufferSize;
  encoded.numberOfPointPixels = polyData.numberOfPointPixels;
  encoded.numberOfCellPixels = polyData.numberOfCellPixels;

  let usedWebWorker = options.webWorker;
  const decoder = new TextDecoder("utf-8");
  for (const prop of [
    "points",
    "vertices",
    "lines",
    "polygons",
    "triangleStrips",
    "pointData",
    "cellData",
  ]) {
    // @ts-ignore: TS7053
    if (polyData[prop] === null) {
      // @ts-ignore: TS7053
      encoded[prop] = null;
    } else {
      // @ts-ignore: TS7053
      const dataBytes = new Uint8Array(polyData[prop].buffer);
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

  return { encoded, webWorker: usedWebWorker as Worker };
}

export interface JsonToPolyDataResult extends WorkerPoolFunctionResult {
  decoded: PolyData;
}

export interface JsonToPolyDataOptions extends WorkerPoolFunctionOption {}

export async function jsonToPolyData(
  encoded: PolyDataJson,
  options: JsonToPolyDataOptions = {},
): Promise<JsonToPolyDataResult> {
  // @ts-ignore: TS7053
  const decoded = encoded as PolyData;

  const componentTypeMap = new Map([
    ["points", "float32"],
    ["vertices", "uint32"],
    ["lines", "uint32"],
    ["polygons", "uint32"],
    ["triangleStrips", "uint32"],
    ["pointData", decoded.polyDataType.pointPixelComponentType],
    ["cellData", decoded.polyDataType.cellPixelComponentType],
  ]);

  const encoder = new TextEncoder();
  let usedWebWorker = options.webWorker;
  for (const prop of [
    "points",
    "vertices",
    "lines",
    "polygons",
    "triangleStrips",
    "pointData",
    "cellData",
  ]) {
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
        componentTypeMap.get(prop),
        decodedProp.output.buffer,
      );
    }
  }

  return { decoded, webWorker: usedWebWorker as Worker };
}
