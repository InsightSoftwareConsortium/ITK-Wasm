import test from 'ava'
import path from 'path'

import ExtensionToIO from '../../../dist/io/internal/extensionToMeshIO.js'

test('vtk maps to itkVTKPolyDataMeshIOJSBinding', t => {
  const io = ExtensionToIO.get('vtk')
  t.is(io, 'itkVTKPolyDataMeshIOJSBinding')
})

test('VTK maps to itkVTKPolyDataMeshIOJSBinding', t => {
  const io = ExtensionToIO.get('VTK')
  t.is(io, 'itkVTKPolyDataMeshIOJSBinding')
})

test('byu maps to itkBYUMeshIOJSBinding', t => {
  const io = ExtensionToIO.get('byu')
  t.is(io, 'itkBYUMeshIOJSBinding')
})

test('BYU maps to itkBYUMeshIOJSBinding', t => {
  const io = ExtensionToIO.get('BYU')
  t.is(io, 'itkBYUMeshIOJSBinding')
})

test('fsa maps to itkFreeSurferAsciiMeshIOJSBinding', t => {
  const io = ExtensionToIO.get('fsa')
  t.is(io, 'itkFreeSurferAsciiMeshIOJSBinding')
})

test('FSA maps to itkFreeSurferAsciiMeshIOJSBinding', t => {
  const io = ExtensionToIO.get('FSA')
  t.is(io, 'itkFreeSurferAsciiMeshIOJSBinding')
})

test('fsb maps to itkFreeSurferBinaryMeshIOJSBinding', t => {
  const io = ExtensionToIO.get('fsb')
  t.is(io, 'itkFreeSurferBinaryMeshIOJSBinding')
})

test('FSB maps to itkFreeSurferBinaryMeshIOJSBinding', t => {
  const io = ExtensionToIO.get('FSB')
  t.is(io, 'itkFreeSurferBinaryMeshIOJSBinding')
})

test('obj maps to itkOBJMeshIOJSBinding', t => {
  const io = ExtensionToIO.get('obj')
  t.is(io, 'itkOBJMeshIOJSBinding')
})

test('OBJ maps to itkOBJMeshIOJSBinding', t => {
  const io = ExtensionToIO.get('OBJ')
  t.is(io, 'itkOBJMeshIOJSBinding')
})

test('off maps to itkOFFMeshIOJSBinding', t => {
  const io = ExtensionToIO.get('off')
  t.is(io, 'itkOFFMeshIOJSBinding')
})

test('OFF maps to itkOFFMeshIOJSBinding', t => {
  const io = ExtensionToIO.get('OFF')
  t.is(io, 'itkOFFMeshIOJSBinding')
})

test('stl maps to itkSTLMeshIOJSBinding', t => {
  const io = ExtensionToIO.get('stl')
  t.is(io, 'itkSTLMeshIOJSBinding')
})

test('STL maps to itkSTLMeshIOJSBinding', t => {
  const io = ExtensionToIO.get('STL')
  t.is(io, 'itkSTLMeshIOJSBinding')
})
