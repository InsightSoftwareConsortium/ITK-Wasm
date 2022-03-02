const extensionToIO = new Map([
  ['vtk', 'itkVTKPolyDataMeshIO'],
  ['VTK', 'itkVTKPolyDataMeshIO'],
  ['byu', 'itkBYUMeshIO'],
  ['BYU', 'itkBYUMeshIO'],
  ['fsa', 'itkFreeSurferAsciiMeshIO'],
  ['FSA', 'itkFreeSurferAsciiMeshIO'],
  ['fsb', 'itkFreeSurferBinaryMeshIO'],
  ['FSB', 'itkFreeSurferBinaryMeshIO'],
  ['obj', 'itkOBJMeshIO'],
  ['OBJ', 'itkOBJMeshIO'],
  ['off', 'itkOFFMeshIO'],
  ['OFF', 'itkOFFMeshIO'],
  ['stl', 'itkSTLMeshIO'],
  ['STL', 'itkSTLMeshIO'],
  ['iwm', 'itkWASMMeshIO'],
  ['iwm.cbor', 'itkWASMMeshIO'],
  ['iwm.cbor.zstd', 'itkWASMZstdMeshIO']
])

export default extensionToIO
