from dataclasses import dataclass, field
from enum import Enum
from typing import Sequence, Union, Dict, Optional, List

try:
    from numpy.typing import ArrayLike
except ImportError:
    from numpy import ndarray as ArrayLike
import numpy as np

class TransformParameterizations(str, Enum):
    Composite = "Composite"
    Identity = "Identity"
    Translation = "Translation"
    Euler2D = "Euler2D"
    Euler3D = "Euler3D"
    Rigid2D = "Rigid2D"
    Rigid3D = "Rigid3D"
    Rigid3DPerspective = "Rigid3DPerspective"
    Versor = "Versor"
    VersorRigid3D = "VersorRigid3D"
    Scale = "Scale"
    ScaleLogarithmic = "ScaleLogarithmic"
    ScaleSkewVersor3D = "ScaleSkewVersor3D"
    Similarity2D = "Similarity2D"
    Similarity3D = "Similarity3D"
    QuaternionRigid = "QuaternionRigid"
    Affine = "Affine"
    ScalableAffine = "ScalableAffine"
    AzimuthElevationToCartesian = "AzimuthElevationToCartesian"
    BSpline = "BSpline"
    BSplineSmoothingOnUpdateDisplacementField = "BSplineSmoothingOnUpdateDisplacementField"
    ConstantVelocityField = "ConstantVelocityField"
    DisplacementField = "DisplacementField"
    GaussianSmoothingOnUpdateDisplacementField = "GaussianSmoothingOnUpdateDisplacementField"
    GaussianExponentialDiffeomorphic = "GaussianExponentialDiffeomorphic"
    VelocityField = "VelocityField"
    TimeVaryingVelocityField = "TimeVaryingVelocityField"
    GaussianSmoothingOnUpdateTimeVaryingVelocityField = "GaussianSmoothingOnUpdateTimeVaryingVelocityField"

@dataclass
class TransformType:
    inputDimension: int = 3
    outputDimension: int = 3
    transformParameterization: TransformParameterizations = TransformParameterizations.Identity

@dataclass
class Transform:
    transformType: Union[TransformType, Dict] = field(default_factory=TransformType)
    numberOfFixedParameters: int = 0
    numberOfParameters: int = 0

    name: str = "Transform"

    inputSpaceName: str = ""
    outputSpaceName: str = ""

    fixedParameters: Optional[ArrayLike] = None
    parameters: Optional[ArrayLike] = None

    metadata: Dict = field(default_factory=dict)

    def __post_init__(self):
        if isinstance(self.transformType, dict):
            self.transformType = TransformType(**self.transformType)

TransformList = List[Transform]