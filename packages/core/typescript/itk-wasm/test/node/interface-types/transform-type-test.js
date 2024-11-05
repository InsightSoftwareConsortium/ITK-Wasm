import test from 'ava'

import {
  TransformType,
  TransformParameterizations
} from '../../../dist/index-node.js'

test('inputDimension should have a default value of 3', (t) => {
  const transformType = new TransformType()
  t.is(transformType.inputDimension, 3)
})
test('inputDimension should have the same value passed to the constructor', (t) => {
  const transformType = new TransformType(2)
  t.is(transformType.inputDimension, 2)
})

test('outputDimension should have a default value of 3', (t) => {
  const transformType = new TransformType()
  t.is(transformType.outputDimension, 3)
})
test('outputDimension should have the same value passed to the constructor', (t) => {
  const transformType = new TransformType(2, 2)
  t.is(transformType.outputDimension, 2)
})

test('transformParameterization should have a default value of Identity', (t) => {
  const transformType = new TransformType()
  t.is(
    transformType.transformParameterization,
    TransformParameterizations.Identity
  )
})
test('transformParameterization should have the same value passed to the constructor', (t) => {
  const transformType = new TransformType(
    2,
    2,
    TransformParameterizations.Affine
  )
  t.is(
    transformType.transformParameterization,
    TransformParameterizations.Affine
  )
})
