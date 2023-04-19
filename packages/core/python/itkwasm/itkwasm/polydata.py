from dataclasses import dataclass, field
from typing import Union, Optional, Dict

try:
    from numpy.typing import ArrayLike
except ImportError:
    from numpy import ndarray as ArrayLike
import numpy as np

from .float_types import FloatTypes
from .int_types import IntTypes
from .pixel_types import PixelTypes

@dataclass
class PolyDataType:
    pointPixelComponentType: Union[IntTypes, FloatTypes] = FloatTypes.Float32
    pointPixelType: PixelTypes = PixelTypes.Scalar
    pointPixelComponents: int = 1

    cellPixelComponentType: Union[IntTypes, FloatTypes] = FloatTypes.Float32
    cellPixelType: PixelTypes = PixelTypes.Scalar
    cellPixelComponents: int = 1

def _default_points() -> ArrayLike:
    return np.empty((0,), np.float32)

@dataclass
class PolyData:
    polyDataType: Union[PolyDataType, Dict] = field(default_factory=PolyDataType)
    name: str = 'PolyData'

    numberOfPoints: int = 0
    points: ArrayLike = field(default_factory=_default_points)

    verticesBufferSize: int = 0
    vertices: Optional[ArrayLike] = None

    linesBufferSize: int = 0
    lines: Optional[ArrayLike] = None

    polygonsBufferSize: int = 0
    polygons: Optional[ArrayLike] = None

    triangleStripsBufferSize: int = 0
    triangleStrips: Optional[ArrayLike] = None

    numberOfPointPixels: int = 0
    pointData: Optional[ArrayLike] = None

    numberOfCellPixels: int = 0
    cellData: Optional[ArrayLike] = None

    def __post_init__(self):
        if isinstance(self.polyDataType, dict):
            self.polyDataType = PolyDataType(**self.polyDataType)
