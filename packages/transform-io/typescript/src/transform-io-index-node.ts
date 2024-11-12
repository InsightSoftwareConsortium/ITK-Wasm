import hdf5ReadTransformNode from "./hdf5-read-transform-node.js";
import hdf5WriteTransformNode from "./hdf5-write-transform-node.js";
import matReadTransformNode from "./mat-read-transform-node.js";
import matWriteTransformNode from "./mat-write-transform-node.js";
import mncReadTransformNode from "./mnc-read-transform-node.js";
import mncWriteTransformNode from "./mnc-write-transform-node.js";
import txtReadTransformNode from "./txt-read-transform-node.js";
import txtWriteTransformNode from "./txt-write-transform-node.js";
import wasmReadTransformNode from "./wasm-read-transform-node.js";
import wasmWriteTransformNode from "./wasm-write-transform-node.js";
import wasmZstdReadTransformNode from "./wasm-zstd-read-transform-node.js";
import wasmZstdWriteTransformNode from "./wasm-zstd-write-transform-node.js";

const meshIoIndexNode = new Map([
  ["hdf5", [hdf5ReadTransformNode, hdf5WriteTransformNode]],
  ["mat", [matReadTransformNode, matWriteTransformNode]],
  ["mnc", [mncReadTransformNode, mncWriteTransformNode]],
  ["txt", [txtReadTransformNode, txtWriteTransformNode]],
  ["wasm", [wasmReadTransformNode, wasmWriteTransformNode]],
  ["wasmZstd", [wasmZstdReadTransformNode, wasmZstdWriteTransformNode]],
]);

export default meshIoIndexNode;
