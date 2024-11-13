import hdf5ReadTransform from "./hdf5-read-transform.js";
import hdf5WriteTransform from "./hdf5-write-transform.js";
import matReadTransform from "./mat-read-transform.js";
import matWriteTransform from "./mat-write-transform.js";
import mncReadTransform from "./mnc-read-transform.js";
import mncWriteTransform from "./mnc-write-transform.js";
import txtReadTransform from "./txt-read-transform.js";
import txtWriteTransform from "./txt-write-transform.js";
import wasmReadTransform from "./wasm-read-transform.js";
import wasmWriteTransform from "./wasm-write-transform.js";
import wasmZstdReadTransform from "./wasm-zstd-read-transform.js";
import wasmZstdWriteTransform from "./wasm-zstd-write-transform.js";

const transformIoIndex = new Map([
  ["hdf5", [hdf5ReadTransform, hdf5WriteTransform]],
  ["mat", [matReadTransform, matWriteTransform]],
  ["mnc", [mncReadTransform, mncWriteTransform]],
  ["txt", [txtReadTransform, txtWriteTransform]],
  ["wasm", [wasmReadTransform, wasmWriteTransform]],
  ["wasmZstd", [wasmZstdReadTransform, wasmZstdWriteTransform]],
]);

export default transformIoIndex;
