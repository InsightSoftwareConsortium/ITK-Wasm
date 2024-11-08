import TransformParameterizations from './transform-parameterizations.js'
import FloatTypes from './float-types.js'

class TransformType {
  constructor (
    public readonly transformParameterization: (typeof TransformParameterizations)[keyof typeof TransformParameterizations] = TransformParameterizations.Identity,
    public readonly parametersValueType: typeof FloatTypes[keyof typeof FloatTypes] = FloatTypes.Float64,
    public readonly inputDimension: number = 3,
    public readonly outputDimension: number = 3
  ) {}
}

export default TransformType
