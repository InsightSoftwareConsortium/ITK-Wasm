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
class MeshType:
    dimension: int = 3

    pointComponentType: Union[IntTypes, FloatTypes] = FloatTypes.Float32
    pointPixelComponentType: Union[IntTypes, FloatTypes] = FloatTypes.Float32
    pointPixelType: PixelTypes = PixelTypes.Scalar
    pointPixelComponents: int = 1

    cellComponentType: Union[IntTypes, FloatTypes] = IntTypes.Int32
    cellPixelComponentType: Union[IntTypes, FloatTypes] = FloatTypes.Float32
    cellPixelType: PixelTypes = PixelTypes.Scalar
    cellPixelComponents: int = 1


@dataclass
class Mesh:
    meshType: Union[MeshType, Dict] = field(default_factory=MeshType)

    name: str = 'Mesh'

    numberOfPoints: int = 0
    points: Optional[ArrayLike] = None

    numberOfPointPixels: int = 0
    pointData: Optional[ArrayLike] = None

    numberOfCells: int = 0
    cells: Optional[ArrayLike] = None
    cellBufferSize: int = 0

    numberOfCellPixels: int = 0
    cellData: Optional[ArrayLike] = None

    def __post_init__(self):
        if isinstance(self.meshType, dict):
            self.meshType = MeshType(**self.meshType)
