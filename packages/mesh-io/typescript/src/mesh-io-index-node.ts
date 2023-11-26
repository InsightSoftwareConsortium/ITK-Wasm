import vtkPolyDataReadMeshNode from './vtk-poly-data-read-mesh-node.js'
import vtkPolyDataWriteMeshNode from './vtk-poly-data-write-mesh-node.js'
import objReadMeshNode from './obj-read-mesh-node.js'
import objWriteMeshNode from './obj-write-mesh-node.js'
import stlReadMeshNode from './stl-read-mesh-node.js'
import stlWriteMeshNode from './stl-write-mesh-node.js'
import offReadMeshNode from './off-read-mesh-node.js'
import offWriteMeshNode from './off-write-mesh-node.js'
import wasmReadMeshNode from './wasm-read-mesh-node.js'
import wasmWriteMeshNode from './wasm-write-mesh-node.js'
import wasmZstdReadMeshNode from './wasm-zstd-read-mesh-node.js'
import wasmZstdWriteMeshNode from './wasm-zstd-write-mesh-node.js'
import swcReadMeshNode from './swc-read-mesh-node.js'
import swcWriteMeshNode from './swc-write-mesh-node.js'
import byuReadMeshNode from './byu-read-mesh-node.js'
import byuWriteMeshNode from './byu-write-mesh-node.js'
import freeSurferAsciiReadMeshNode from './free-surfer-ascii-read-mesh-node.js'
import freeSurferAsciiWriteMeshNode from './free-surfer-ascii-write-mesh-node.js'
import freeSurferBinaryReadMeshNode from './free-surfer-binary-read-mesh-node.js'
import freeSurferBinaryWriteMeshNode from './free-surfer-binary-write-mesh-node.js'

const meshIoIndexNode = new Map([
  ['vtk', [vtkPolyDataReadMeshNode, vtkPolyDataWriteMeshNode]],
  ['obj', [objReadMeshNode, objWriteMeshNode]],
  ['stl', [stlReadMeshNode, stlWriteMeshNode]],
  ['off', [offReadMeshNode, offWriteMeshNode]],
  ['wasm', [wasmReadMeshNode, wasmWriteMeshNode]],
  ['wasm-zst', [wasmZstdReadMeshNode, wasmZstdWriteMeshNode]],
  ['swc', [swcReadMeshNode, swcWriteMeshNode]],
  ['byu', [byuReadMeshNode, byuWriteMeshNode]],
  ['free-surfer-ascii', [freeSurferAsciiReadMeshNode, freeSurferAsciiWriteMeshNode]],
  ['free-surfer-binary', [freeSurferBinaryReadMeshNode, freeSurferBinaryWriteMeshNode]],
])

export default meshIoIndexNode
