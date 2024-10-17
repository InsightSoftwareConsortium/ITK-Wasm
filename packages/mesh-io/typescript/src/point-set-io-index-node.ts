import vtkPolyDataReadPointSetNode from "./vtk-poly-data-read-point-set-node.js";
import vtkPolyDataWritePointSetNode from "./vtk-poly-data-write-point-set-node.js";
import objReadPointSetNode from "./obj-read-point-set-node.js";
import objWritePointSetNode from "./obj-write-point-set-node.js";
import offReadPointSetNode from "./off-read-point-set-node.js";
import offWritePointSetNode from "./off-write-point-set-node.js";
import wasmReadPointSetNode from "./wasm-read-point-set-node.js";
import wasmWritePointSetNode from "./wasm-write-point-set-node.js";
import wasmZstdReadPointSetNode from "./wasm-zstd-read-point-set-node.js";
import wasmZstdWritePointSetNode from "./wasm-zstd-write-point-set-node.js";

const pointSetIoIndexNode = new Map([
  ["vtk", [vtkPolyDataReadPointSetNode, vtkPolyDataWritePointSetNode]],
  ["obj", [objReadPointSetNode, objWritePointSetNode]],
  ["off", [offReadPointSetNode, offWritePointSetNode]],
  ["wasm", [wasmReadPointSetNode, wasmWritePointSetNode]],
  ["wasm-zst", [wasmZstdReadPointSetNode, wasmZstdWritePointSetNode]],
]);

export default pointSetIoIndexNode;
