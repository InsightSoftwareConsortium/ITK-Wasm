import test from 'ava'

import { TransformParameterizations } from '../../../dist/index-node.js'

test('every parameterization value is its own key', (t) => {
  for (const [key, value] of Object.entries(TransformParameterizations)) {
    t.is(value, key)
  }
})

test('time-varying velocity field parameterizations match the ITK class names', (t) => {
  t.is(TransformParameterizations.TimeVaryingVelocityField, 'TimeVaryingVelocityField')
  t.is(
    TransformParameterizations.GaussianSmoothingOnUpdateTimeVaryingVelocityField,
    'GaussianSmoothingOnUpdateTimeVaryingVelocityField'
  )
  for (const key of Object.keys(TransformParameterizations)) {
    t.false(key.includes('Varing'))
  }
})
