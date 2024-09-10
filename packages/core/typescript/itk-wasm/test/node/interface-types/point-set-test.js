import test from 'ava'

import { PointSet, PointSetType } from '../../../dist/index-node.js'

test('pointSetType should have the same pointSetType passed to the constructor', t => {
  const pointSet = new PointSet()
  const defaultPointSetType = new PointSetType()
  t.deepEqual(pointSet.pointSetType, defaultPointSetType)
})

test('name should have the default value of "PointSet"', t => {
  const pointSet = new PointSet()
  t.deepEqual(pointSet.name, 'PointSet')
})

test('numberOfPoints should have a default value of 0', t => {
  const pointSet = new PointSet()
  t.is(pointSet.numberOfPoints, 0)
})

test('points should have a default value of null', t => {
  const pointSet = new PointSet()
  t.is(pointSet.points, null)
})

test('numberOfPointPixels should have a default value of 0', t => {
  const pointSet = new PointSet()
  t.is(pointSet.numberOfPointPixels, 0)
})

test('pointData should have a default value of null', t => {
  const pointSet = new PointSet()
  t.is(pointSet.pointData, null)
})
