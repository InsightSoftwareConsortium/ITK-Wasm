const TransformParameterizations = {
  Composite: 'Composite',
  Identity: 'Identity',
  Translation: 'Translation',
  Euler2D: 'Euler2D',
  Euler3D: 'Euler3D',
  Rigid2D: 'Rigid2D',
  Rigid3D: 'Rigid3D',
  Rigid3DPerspective: 'Rigid3DPerspective',
  Versor: 'Versor',
  VersorRigid3D: 'VersorRigid3D',
  Scale: 'Scale',
  ScaleLogarithmic: 'ScaleLogarithmic',
  ScaleSkewVersor3D: 'ScaleSkewVersor3D',
  Similarity2D: 'Similarity2D',
  Similarity3D: 'Similarity3D',
  QuaternionRigid: 'QuaternionRigid',
  Affine: 'Affine',
  ScalableAffine: 'ScalableAffine',
  AzimuthElevationToCartesian: 'AzimuthElevationToCartesian',
  BSpline: 'BSpline',
  BSplineSmoothingOnUpdateDisplacementField:
    'BSplineSmoothingOnUpdateDisplacementField',
  ConstantVelocityField: 'ConstantVelocityField',
  DisplacementField: 'DisplacementField',
  GaussianSmoothingOnUpdateDisplacementField:
    'GaussianSmoothingOnUpdateDisplacementField',
  GaussianExponentialDiffeomorphic: 'GaussianExponentialDiffeomorphic',
  VelocityField: 'VelocityField',
  TimeVaringVelocityField: 'TimeVaringVelocityField',
  GaussianSmoothingOnUpdateTimeVaringVelocityField:
    'GaussianSmoothingOnUpdateTimeVaringVelocityField'
} as const

export default TransformParameterizations
