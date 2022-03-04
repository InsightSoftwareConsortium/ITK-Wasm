import test from 'ava'

import ExtensionToIO from '../../../../dist/io/internal/extensionToMeshIO.js'

test('vtk maps to itkVTKPolyDataMeshIO', t => {
  const io = ExtensionToIO.get('vtk')
  t.is(io, 'itkVTKPolyDataMeshIO')
})

test('VTK maps to itkVTKPolyDataMeshIO', t => {
  const io = ExtensionToIO.get('VTK')
  t.is(io, 'itkVTKPolyDataMeshIO')
})

test('byu maps to itkBYUMeshIO', t => {
  const io = ExtensionToIO.get('byu')
  t.is(io, 'itkBYUMeshIO')
})

test('BYU maps to itkBYUMeshIO', t => {
  const io = ExtensionToIO.get('BYU')
  t.is(io, 'itkBYUMeshIO')
})

test('fsa maps to itkFreeSurferAsciiMeshIO', t => {
  const io = ExtensionToIO.get('fsa')
  t.is(io, 'itkFreeSurferAsciiMeshIO')
})

test('FSA maps to itkFreeSurferAsciiMeshIO', t => {
  const io = ExtensionToIO.get('FSA')
  t.is(io, 'itkFreeSurferAsciiMeshIO')
})

test('fsb maps to itkFreeSurferBinaryMeshIO', t => {
  const io = ExtensionToIO.get('fsb')
  t.is(io, 'itkFreeSurferBinaryMeshIO')
})

test('FSB maps to itkFreeSurferBinaryMeshIO', t => {
  const io = ExtensionToIO.get('FSB')
  t.is(io, 'itkFreeSurferBinaryMeshIO')
})

test('obj maps to itkOBJMeshIO', t => {
  const io = ExtensionToIO.get('obj')
  t.is(io, 'itkOBJMeshIO')
})

test('OBJ maps to itkOBJMeshIO', t => {
  const io = ExtensionToIO.get('OBJ')
  t.is(io, 'itkOBJMeshIO')
})

test('off maps to itkOFFMeshIO', t => {
  const io = ExtensionToIO.get('off')
  t.is(io, 'itkOFFMeshIO')
})

test('OFF maps to itkOFFMeshIO', t => {
  const io = ExtensionToIO.get('OFF')
  t.is(io, 'itkOFFMeshIO')
})

test('stl maps to itkSTLMeshIO', t => {
  const io = ExtensionToIO.get('stl')
  t.is(io, 'itkSTLMeshIO')
})

test('STL maps to itkSTLMeshIO', t => {
  const io = ExtensionToIO.get('STL')
  t.is(io, 'itkSTLMeshIO')
})

test('iwm maps to itkWASMMeshIO', t => {
  const io = ExtensionToIO.get('iwm')
  t.is(io, 'itkWASMMeshIO')
})

test('iwm.cbor maps to itkWASMMeshIO', t => {
  const io = ExtensionToIO.get('iwm.cbor')
  t.is(io, 'itkWASMMeshIO')
})

test('iwm.cbor.zstd maps to itkWASMMeshIO', t => {
  const io = ExtensionToIO.get('iwm.cbor.zstd')
  t.is(io, 'itkWASMZstdMeshIO')
})
