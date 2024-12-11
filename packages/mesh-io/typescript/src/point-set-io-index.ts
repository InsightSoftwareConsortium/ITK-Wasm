import vtkPolyDataReadPointSet from "./vtk-poly-data-read-point-set.js";
import vtkPolyDataWritePointSet from "./vtk-poly-data-write-point-set.js";
import mz3ReadPointSet from "./mz3-read-point-set.js";
import mz3WritePointSet from "./mz3-write-point-set.js";
import objReadPointSet from "./obj-read-point-set.js";
import objWritePointSet from "./obj-write-point-set.js";
import offReadPointSet from "./off-read-point-set.js";
import offWritePointSet from "./off-write-point-set.js";
import wasmReadPointSet from "./wasm-read-point-set.js";
import wasmWritePointSet from "./wasm-write-point-set.js";
import wasmZstdReadPointSet from "./wasm-zstd-read-point-set.js";
import wasmZstdWritePointSet from "./wasm-zstd-write-point-set.js";

const pointSetIoIndex = new Map([
  ["vtk", [vtkPolyDataReadPointSet, vtkPolyDataWritePointSet]],
  ["mz3", [mz3ReadPointSet, mz3WritePointSet]],
  ["obj", [objReadPointSet, objWritePointSet]],
  ["off", [offReadPointSet, offWritePointSet]],
  ["wasm", [wasmReadPointSet, wasmWritePointSet]],
  ["wasm-zst", [wasmZstdReadPointSet, wasmZstdWritePointSet]],
]);

export default pointSetIoIndex;
