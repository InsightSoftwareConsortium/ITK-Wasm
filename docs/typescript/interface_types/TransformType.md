# TransformType

An [`TransformType`] describes parameterization, parameter value type, and input and output dimensions of the transform. It is a JavaScript object with the following properties:

- `transformParameterization`: The [TransformParameterization](./TransformParameterizations) for this transform.
- `parametersValueType`: Whether the transform parameters are `float32` or `float64`.
- `inputDimension`: The number of dimensions of the input space.
- `outputDimension`: The number of dimensions of the output space.

[`TransformType`]: ../../model/TransformType.md