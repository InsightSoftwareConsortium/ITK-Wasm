const extensionToIO = new Map([
  ['vtk', 'VTKPolyDataMeshIO'],
  ['VTK', 'VTKPolyDataMeshIO'],
  ['byu', 'BYUMeshIO'],
  ['BYU', 'BYUMeshIO'],
  ['fsa', 'FreeSurferAsciiMeshIO'],
  ['FSA', 'FreeSurferAsciiMeshIO'],
  ['fsb', 'FreeSurferBinaryMeshIO'],
  ['FSB', 'FreeSurferBinaryMeshIO'],
  ['obj', 'OBJMeshIO'],
  ['OBJ', 'OBJMeshIO'],
  ['off', 'OFFMeshIO'],
  ['OFF', 'OFFMeshIO'],
  ['stl', 'STLMeshIO'],
  ['STL', 'STLMeshIO'],
  ['swc', 'SWCMeshIO'],
  ['SWC', 'SWCMeshIO'],
  ['iwm', 'WasmMeshIO'],
  ['iwm.cbor', 'WasmMeshIO'],
  ['iwm.cbor.zstd', 'WasmZstdMeshIO']
])

export default extensionToIO
