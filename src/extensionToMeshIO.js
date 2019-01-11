let extensionToIO = {}

extensionToIO['vtk'] = 'itkVTKPolyDataMeshIOJSBinding'
extensionToIO['VTK'] = 'itkVTKPolyDataMeshIOJSBinding'
extensionToIO['byu'] = 'itkBYUMeshIOJSBinding'
extensionToIO['BYU'] = 'itkBYUMeshIOJSBinding'
extensionToIO['fsa'] = 'itkFreeSurferAsciiMeshIOJSBinding'
extensionToIO['FSA'] = 'itkFreeSurferAsciiMeshIOJSBinding'
extensionToIO['fsb'] = 'itkFreeSurferBinaryMeshIOJSBinding'
extensionToIO['FSB'] = 'itkFreeSurferBinaryMeshIOJSBinding'

module.exports = extensionToIO
