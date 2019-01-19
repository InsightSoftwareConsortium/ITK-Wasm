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

test('byu maps to itkBYUMeshIOJSBinding', t => {
  let io = ExtensionToIO['byu']
  t.is(io, 'itkBYUMeshIOJSBinding')
})

test('BYU maps to itkBYUMeshIOJSBinding', t => {
  let io = ExtensionToIO['BYU']
  t.is(io, 'itkBYUMeshIOJSBinding')
})

test('fsa maps to itkFreeSurferAsciiMeshIOJSBinding', t => {
  let io = ExtensionToIO['fsa']
  t.is(io, 'itkFreeSurferAsciiMeshIOJSBinding')
})

test('FSA maps to itkFreeSurferAsciiMeshIOJSBinding', t => {
  let io = ExtensionToIO['FSA']
  t.is(io, 'itkFreeSurferAsciiMeshIOJSBinding')
})

test('fsb maps to itkFreeSurferBinaryMeshIOJSBinding', t => {
  let io = ExtensionToIO['fsb']
  t.is(io, 'itkFreeSurferBinaryMeshIOJSBinding')
})

test('FSB maps to itkFreeSurferBinaryMeshIOJSBinding', t => {
  let io = ExtensionToIO['FSB']
  t.is(io, 'itkFreeSurferBinaryMeshIOJSBinding')
})

test('obj maps to itkOBJMeshIOJSBinding', t => {
  let io = ExtensionToIO['obj']
  t.is(io, 'itkOBJMeshIOJSBinding')
})

test('OBJ maps to itkOBJMeshIOJSBinding', t => {
  let io = ExtensionToIO['OBJ']
  t.is(io, 'itkOBJMeshIOJSBinding')
})

test('off maps to itkOFFMeshIOJSBinding', t => {
  let io = ExtensionToIO['off']
  t.is(io, 'itkOFFMeshIOJSBinding')
})

test('OFF maps to itkOFFMeshIOJSBinding', t => {
  let io = ExtensionToIO['OFF']
  t.is(io, 'itkOFFMeshIOJSBinding')
})
