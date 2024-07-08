import test from 'ava'

import { PolyData } from '../../../dist/index-node.js'

test('name should have the default value of "PolyData"', (t) => {
  const polyData = new PolyData()
  t.deepEqual(polyData.name, 'PolyData')
})

test('points should be a Float32Array', (t) => {
  const polyData = new PolyData()
  t.assert(polyData.points instanceof Float32Array)
})

test('points should have a default length of 0', (t) => {
  const polyData = new PolyData()
  t.is(polyData.points.length, 0)
})

test('lines should have a default value of null', (t) => {
  const polyData = new PolyData()
  t.is(polyData.lines, null)
})

test('vertices should have a default value of null', (t) => {
  const polyData = new PolyData()
  t.is(polyData.vertices, null)
})

test('polygons should have a default value of null', (t) => {
  const polyData = new PolyData()
  t.is(polyData.polygons, null)
})

test('triangleStrips should have a default value of null', (t) => {
  const polyData = new PolyData()
  t.is(polyData.triangleStrips, null)
})
