import { bufferToTypedArray, Image, Mesh, PolyData } from "itk-wasm";

import compressStringifyNode from "./compress-stringify-node.js";
import parseStringDecompressNode from "./parse-string-decompress-node.js";

import {
  ImageJson,
  MeshJson,
  PolyDataJson,
} from "./interface-type-json-common.js";

export interface ImageToJsonNodeResult {
  encoded: ImageJson;
}

export async function imageToJsonNode(
  image: Image,
): Promise<ImageToJsonNodeResult> {
  const level = 5;

  const encoded = new Image(image.imageType) as unknown as ImageJson;
  encoded.origin = image.origin;
  encoded.spacing = image.spacing;
  encoded.size = image.size;
  encoded.metadata = image.metadata;

  const decoder = new TextDecoder("utf-8");
  const directionBytes = new Uint8Array(image.direction.buffer);
  const direction = await compressStringifyNode(directionBytes, {
    compressionLevel: level,
    stringify: true,
  });
  encoded.direction = decoder.decode(direction.output.buffer);

  if (image.data === null) {
    encoded.data = null;
  } else {
    const dataBytes = new Uint8Array(image.data.buffer);
    const encodedData = await compressStringifyNode(dataBytes, {
      compressionLevel: level,
      stringify: true,
    });
    encoded.data = decoder.decode(encodedData.output.buffer);
  }

  return { encoded };
}

export interface JsonToImageNodeResult {
  decoded: Image;
}

export async function jsonToImageNode(
  encoded: ImageJson,
): Promise<JsonToImageNodeResult> {
  const decoded = encoded as unknown as Image;

  const encoder = new TextEncoder();
  const directionBytes = new Uint8Array(encoder.encode(encoded.direction));
  const direction = await parseStringDecompressNode(directionBytes, {
    parseString: true,
  });
  decoded.direction = new Float64Array(direction.output.buffer);

  if (!decoded.data) {
    decoded.data = null;
  } else {
    const dataBytes = new Uint8Array(encoder.encode(encoded.data as string));
    const decodedData = await parseStringDecompressNode(dataBytes, {
      parseString: true,
    });
    decoded.data = bufferToTypedArray(
      decoded.imageType.componentType,
      decodedData.output.buffer,
    );
  }

  return { decoded };
}

export interface MeshToJsonNodeResult {
  encoded: MeshJson;
}

export async function meshToJsonNode(
  mesh: Mesh,
): Promise<MeshToJsonNodeResult> {
  const level = 5;

  const encoded = new Mesh(mesh.meshType) as unknown as MeshJson;
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

  return { encoded };
}

export interface JsonToMeshNodeResult {
  decoded: Mesh;
}

export async function jsonToMeshNode(
  encoded: MeshJson,
): Promise<JsonToMeshNodeResult> {
  const decoded = encoded as unknown as Mesh;

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

export interface PolyDataToJsonNodeResult {
  encoded: PolyDataJson;
}

export async function polyDataToJsonNode(
  polyData: PolyData,
): Promise<PolyDataToJsonNodeResult> {
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
      const encodedProp = await compressStringifyNode(dataBytes, {
        compressionLevel: level,
        stringify: true,
      });
      // @ts-ignore
      encoded[prop] = decoder.decode(encodedProp.output.buffer);
    }
  }

  return { encoded };
}

export interface JsonToPolyDataNodeResult {
  decoded: PolyData;
}

export async function jsonToPolyDataNode(
  encoded: PolyDataJson,
): Promise<JsonToPolyDataNodeResult> {
  const decoded = encoded as unknown as PolyData;

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
      const decodedProp = await parseStringDecompressNode(dataBytes, {
        parseString: true,
      });
      // @ts-ignore
      decoded[prop] = bufferToTypedArray(
        // @ts-ignore: TS7053
        componentTypeMap.get(prop),
        decodedProp.output.buffer,
      );
    }
  }

  return { decoded };
}
