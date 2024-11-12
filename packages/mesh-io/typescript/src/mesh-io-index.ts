import vtkPolyDataReadMesh from "./vtk-poly-data-read-mesh.js";
import vtkPolyDataWriteMesh from "./vtk-poly-data-write-mesh.js";
import objReadMesh from "./obj-read-mesh.js";
import objWriteMesh from "./obj-write-mesh.js";
import stlReadMesh from "./stl-read-mesh.js";
import stlWriteMesh from "./stl-write-mesh.js";
import offReadMesh from "./off-read-mesh.js";
import offWriteMesh from "./off-write-mesh.js";
import wasmReadMesh from "./wasm-read-mesh.js";
import wasmWriteMesh from "./wasm-write-mesh.js";
import wasmZstdReadMesh from "./wasm-zstd-read-mesh.js";
import wasmZstdWriteMesh from "./wasm-zstd-write-mesh.js";
import swcReadMesh from "./swc-read-mesh.js";
import swcWriteMesh from "./swc-write-mesh.js";
import byuReadMesh from "./byu-read-mesh.js";
import byuWriteMesh from "./byu-write-mesh.js";
import freeSurferAsciiReadMesh from "./free-surfer-ascii-read-mesh.js";
import freeSurferAsciiWriteMesh from "./free-surfer-ascii-write-mesh.js";
import freeSurferBinaryReadMesh from "./free-surfer-binary-read-mesh.js";
import freeSurferBinaryWriteMesh from "./free-surfer-binary-write-mesh.js";

const meshIoIndex = new Map([
  ["vtk", [vtkPolyDataReadMesh, vtkPolyDataWriteMesh]],
  ["obj", [objReadMesh, objWriteMesh]],
  ["stl", [stlReadMesh, stlWriteMesh]],
  ["off", [offReadMesh, offWriteMesh]],
  ["wasm", [wasmReadMesh, wasmWriteMesh]],
  ["wasmZstd", [wasmZstdReadMesh, wasmZstdWriteMesh]],
  ["swc", [swcReadMesh, swcWriteMesh]],
  ["byu", [byuReadMesh, byuWriteMesh]],
  ["freeSurferAscii", [freeSurferAsciiReadMesh, freeSurferAsciiWriteMesh]],
  ["freeSurferBinary", [freeSurferBinaryReadMesh, freeSurferBinaryWriteMesh]],
]);

export default meshIoIndex;
