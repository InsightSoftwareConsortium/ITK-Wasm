import TransformParameterizations from './transform-parameterizations.js'

class TransformType {
  constructor(
    public readonly inputDimension: number = 3,
    public readonly outputDimension: number = 3,
    public readonly transformParameterization: (typeof TransformParameterizations)[keyof typeof TransformParameterizations] = TransformParameterizations.Identity
  ) {}
}

export default TransformType
