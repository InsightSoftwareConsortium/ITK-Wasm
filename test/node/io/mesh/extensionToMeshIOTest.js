import test from 'ava'

import ExtensionToIO from '../../../../dist/io/internal/extensionToMeshIO.js'

test('vtk maps to VTKPolyDataMeshIO', t => {
  const io = ExtensionToIO.get('vtk')
  t.is(io, 'VTKPolyDataMeshIO')
})

test('VTK maps to VTKPolyDataMeshIO', t => {
  const io = ExtensionToIO.get('VTK')
  t.is(io, 'VTKPolyDataMeshIO')
})

test('byu maps to BYUMeshIO', t => {
  const io = ExtensionToIO.get('byu')
  t.is(io, 'BYUMeshIO')
})

test('BYU maps to BYUMeshIO', t => {
  const io = ExtensionToIO.get('BYU')
  t.is(io, 'BYUMeshIO')
})

test('fsa maps to FreeSurferAsciiMeshIO', t => {
  const io = ExtensionToIO.get('fsa')
  t.is(io, 'FreeSurferAsciiMeshIO')
})

test('FSA maps to FreeSurferAsciiMeshIO', t => {
  const io = ExtensionToIO.get('FSA')
  t.is(io, 'FreeSurferAsciiMeshIO')
})

test('fsb maps to FreeSurferBinaryMeshIO', t => {
  const io = ExtensionToIO.get('fsb')
  t.is(io, 'FreeSurferBinaryMeshIO')
})

test('FSB maps to FreeSurferBinaryMeshIO', t => {
  const io = ExtensionToIO.get('FSB')
  t.is(io, 'FreeSurferBinaryMeshIO')
})

test('obj maps to OBJMeshIO', t => {
  const io = ExtensionToIO.get('obj')
  t.is(io, 'OBJMeshIO')
})

test('OBJ maps to OBJMeshIO', t => {
  const io = ExtensionToIO.get('OBJ')
  t.is(io, 'OBJMeshIO')
})

test('off maps to OFFMeshIO', t => {
  const io = ExtensionToIO.get('off')
  t.is(io, 'OFFMeshIO')
})

test('OFF maps to OFFMeshIO', t => {
  const io = ExtensionToIO.get('OFF')
  t.is(io, 'OFFMeshIO')
})

test('stl maps to STLMeshIO', t => {
  const io = ExtensionToIO.get('stl')
  t.is(io, 'STLMeshIO')
})

test('STL maps to STLMeshIO', t => {
  const io = ExtensionToIO.get('STL')
  t.is(io, 'STLMeshIO')
})

test('iwm maps to WASMMeshIO', t => {
  const io = ExtensionToIO.get('iwm')
  t.is(io, 'WASMMeshIO')
})

test('iwm.cbor maps to WASMMeshIO', t => {
  const io = ExtensionToIO.get('iwm.cbor')
  t.is(io, 'WASMMeshIO')
})

test('iwm.cbor.zstd maps to WASMMeshIO', t => {
  const io = ExtensionToIO.get('iwm.cbor.zstd')
  t.is(io, 'WASMZstdMeshIO')
})
