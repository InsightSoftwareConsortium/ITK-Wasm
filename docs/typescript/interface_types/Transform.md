# Transform

A [`Transform`] specifies a spatial transformation that maps points from one coordinate system to another. The [`Transform`] interface is a JavaScript object with the following properties:

- `transformType`: The [TransformType](./TransformType) for this transform.
- `numberOfFixedParameters`: The number of fixed parameters for the transform. Fixed parameters are not optimized during registration.
- `numberOfParameters`: The number of parameters for the transform.
- `name`: An optional name string that describes this transform.
- `inputSpaceName`: An optional name string that describes the input space.
- `outputSpaceName`: An optional name string that describes the output space.
- `parameters`: A [`TypedArray`] containing the transform parameters.
- `fixedParameters`: A [`TypedArray`] containing the fixed transform parameters.

[`TypedArray`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray

[`Transform`]: ../../model/Transform.md