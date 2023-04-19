from dataclasses import dataclass, field

from typing import Sequence, Union, Dict, Optional

try:
    from numpy.typing import ArrayLike
except ImportError:
    from numpy import ndarray as ArrayLike
import numpy as np

from .int_types import IntTypes
from .float_types import FloatTypes
from .pixel_types import PixelTypes

@dataclass
class ImageType:
    dimension: int = 2
    componentType: Union[IntTypes, FloatTypes] = IntTypes.UInt8
    pixelType: PixelTypes = PixelTypes.Scalar
    components: int = 1

def _default_direction() -> ArrayLike:
    return np.empty((0,), np.float64)

@dataclass
class Image:
    imageType: Union[ImageType, Dict] = field(default_factory=ImageType)
    name: str = 'Image'
    origin: Sequence[float] = field(default_factory=list)
    spacing: Sequence[float] = field(default_factory=list)
    direction: ArrayLike = field(default_factory=_default_direction)
    size: Sequence[int] = field(default_factory=list)
    metadata: Dict = field(default_factory=dict)
    data: Optional[ArrayLike] = None

    def __post_init__(self):
        if isinstance(self.imageType, dict):
            self.imageType = ImageType(**self.imageType)

        dimension = self.imageType.dimension
        if len(self.origin) == 0:
            self.origin += [0.0,] * dimension

        if len(self.spacing) == 0:
            self.spacing += [1.0,] * dimension

        if len(self.direction) == 0:
            self.direction = np.eye(dimension).astype(np.float64)

        if len(self.size) == 0:
            self.size += [1,] * dimension
