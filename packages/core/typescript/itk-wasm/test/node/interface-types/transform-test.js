import test from 'ava'

import { Transform, TransformType } from '../../../dist/index-node.js'

test('transformType should have the same transformType passed to the constructor', t => {
  const transform = new Transform()
  const defaultTransformType = new TransformType()
  t.deepEqual(transform.transformType, defaultTransformType)
})

test('name should have the default value of "Transform"', t => {
  const transform = new Transform()
  t.deepEqual(transform.name, 'Transform')
})

test('numberOfFixedParameters should have a default value of 0', t => {
  const transform = new Transform()
  t.is(transform.numberOfFixedParameters, 0)
})

test('numberOfParameters should have a default value of 0', t => {
  const transform = new Transform()
  t.is(transform.numberOfParameters, 0)
})
