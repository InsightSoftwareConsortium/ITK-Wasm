from dataclasses import dataclass, field

from typing import Optional, Union, Dict

try:
    from numpy.typing import ArrayLike
except ImportError:
    from numpy import ndarray as ArrayLike

from .float_types import FloatTypes
from .int_types import IntTypes
from .pixel_types import PixelTypes

@dataclass
class PointSetType:
    dimension: int = 3

    pointComponentType: Union[IntTypes, FloatTypes] = FloatTypes.Float32
    pointPixelComponentType: Union[IntTypes, FloatTypes] = FloatTypes.Float32
    pointPixelType: PixelTypes = PixelTypes.Scalar
    pointPixelComponents: int = 1


@dataclass
class PointSet:
    pointSetType: Union[PointSetType, Dict] = field(default_factory=PointSetType)

    name: str = 'PointSet'

    numberOfPoints: int = 0
    points: Optional[ArrayLike] = None

    numberOfPointPixels: int = 0
    pointData: Optional[ArrayLike] = None

    def __post_init__(self):
        if isinstance(self.pointSetType, dict):
            self.pointSetType = PointSetType(**self.pointSetType)