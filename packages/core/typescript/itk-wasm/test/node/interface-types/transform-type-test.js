import test from 'ava'

import {
  TransformType,
  TransformParameterizations,
  FloatTypes
} from '../../../dist/index-node.js'

test('inputDimension should have a default value of 3', (t) => {
  const transformType = new TransformType()
  t.is(transformType.inputDimension, 3)
})

test('outputDimension should have a default value of 3', (t) => {
  const transformType = new TransformType()
  t.is(transformType.outputDimension, 3)
})

test('transformParameterization should have a default value of Identity', (t) => {
  const transformType = new TransformType()
  t.is(
    transformType.transformParameterization,
    TransformParameterizations.Identity
  )
})
test('parametersValueType should have the same value passed to the constructor', (t) => {
  const transformType = new TransformType()
  t.is(
    transformType.parametersValueType,
    FloatTypes.Float64
  )
})
