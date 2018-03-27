import test from 'ava'
import path from 'path'

const Mesh = require(path.resolve(__dirname, '..', 'dist', 'Mesh.js'))
const MeshType = require(path.resolve(__dirname, '..', 'dist', 'MeshType.js'))

test('meshType should have the same meshType passed to the constructor', t => {
  let mesh = new Mesh()
  const defaultMeshType = new MeshType()
  t.deepEqual(mesh.meshType, defaultMeshType)
})

test('name should have the default value of "Mesh"', t => {
  let mesh = new Mesh()
  t.deepEqual(mesh.name, 'Mesh')
})

test('numberOfPoints should have a default value of 0', t => {
  let mesh = new Mesh()
  t.is(mesh.numberOfPoints, 0)
})

test('points should have a default value of ArrayBuffer(0)', t => {
  let mesh = new Mesh()
  t.is(mesh.points.byteLength, 0)
})

test('numberOfPointPixels should have a default value of 0', t => {
  let mesh = new Mesh()
  t.is(mesh.numberOfPointPixels, 0)
})

test('pointsData should have a default value of ArrayBuffer(0)', t => {
  let mesh = new Mesh()
  t.is(mesh.pointData.byteLength, 0)
})

test('numberOfCells should have a default value of 0', t => {
  let mesh = new Mesh()
  t.is(mesh.numberOfCells, 0)
})

test('cells should have a default value of ArrayBuffer(0)', t => {
  let mesh = new Mesh()
  t.is(mesh.cells.byteLength, 0)
})

test('numberOfCellPixels should have a default value of 0', t => {
  let mesh = new Mesh()
  t.is(mesh.numberOfCellPixels, 0)
})

test('cellsData should have a default value of ArrayBuffer(0)', t => {
  let mesh = new Mesh()
  t.is(mesh.pointData.byteLength, 0)
})

test('cellBufferSize should have a default value of 0', t => {
  let mesh = new Mesh()
  t.is(mesh.cellBufferSize, 0)
})
