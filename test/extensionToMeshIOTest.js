import test from 'ava'
import path from 'path'

const ExtensionToIO = require(path.resolve(__dirname, '..', 'dist', 'extensionToMeshIO.js'))

test('vtk maps to itkVTKPolyDataMeshIOJSBinding', t => {
  let io = ExtensionToIO['vtk']
  t.is(io, 'itkVTKPolyDataMeshIOJSBinding')
})

test('VTK maps to itkVTKPolyDataMeshIOJSBinding', t => {
  let io = ExtensionToIO['VTK']
  t.is(io, 'itkVTKPolyDataMeshIOJSBinding')
})
