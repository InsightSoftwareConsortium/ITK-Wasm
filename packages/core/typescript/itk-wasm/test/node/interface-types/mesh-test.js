import test from 'ava'

import { Mesh, MeshType } from '../../../dist/index-node.js'

test('meshType should have the same meshType passed to the constructor', t => {
  const mesh = new Mesh()
  const defaultMeshType = new MeshType()
  t.deepEqual(mesh.meshType, defaultMeshType)
})

test('name should have the default value of "Mesh"', t => {
  const mesh = new Mesh()
  t.deepEqual(mesh.name, 'Mesh')
})

test('numberOfPoints should have a default value of 0', t => {
  const mesh = new Mesh()
  t.is(mesh.numberOfPoints, 0)
})

test('points should have a default value of null', t => {
  const mesh = new Mesh()
  t.is(mesh.points, null)
})

test('numberOfPointPixels should have a default value of 0', t => {
  const mesh = new Mesh()
  t.is(mesh.numberOfPointPixels, 0)
})

test('pointData should have a default value of null', t => {
  const mesh = new Mesh()
  t.is(mesh.pointData, null)
})

test('numberOfCells should have a default value of 0', t => {
  const mesh = new Mesh()
  t.is(mesh.numberOfCells, 0)
})

test('cells should have a default value of null', t => {
  const mesh = new Mesh()
  t.is(mesh.cells, null)
})

test('numberOfCellPixels should have a default value of 0', t => {
  const mesh = new Mesh()
  t.is(mesh.numberOfCellPixels, 0)
})

test('cellsData should have a default value of null', t => {
  const mesh = new Mesh()
  t.is(mesh.cellData, null)
})

test('cellBufferSize should have a default value of 0', t => {
  const mesh = new Mesh()
  t.is(mesh.cellBufferSize, 0)
})
