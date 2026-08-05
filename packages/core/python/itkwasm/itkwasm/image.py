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
class ImageRegion:
    index: Sequence[int] = field(default_factory=list)
    size: Sequence[int] = field(default_factory=list)


def _buffered_region_size(data, dimension: int) -> Optional[Sequence[int]]:
    """The buffered region size implied by the shape of a pixel data buffer.

    None when the buffer does not describe the region, so the current region is
    kept. This is the case for a raveled buffer, and for the data: URI that
    transiently occupies the field while pipeline output JSON is deserialized,
    before the buffer it addresses is read into an array.
    """
    shape = getattr(data, "shape", None)
    if shape is None or len(shape) < dimension:
        return None
    return list(shape[:dimension][::-1])


@dataclass
class Image:
    imageType: Union[ImageType, Dict] = field(default_factory=ImageType)

    name: str = "Image"

    origin: Sequence[float] = field(default_factory=list)
    spacing: Sequence[float] = field(default_factory=list)
    direction: ArrayLike = field(default_factory=_default_direction)

    size: Sequence[int] = field(default_factory=list)

    metadata: Dict = field(default_factory=dict)
    data: Optional[ArrayLike] = None
    bufferedRegion: Optional[ImageRegion] = None

    def __post_init__(self):
        dimension = self.imageType.dimension
        if len(self.origin) == 0:
            self.origin += [
                0.0,
            ] * dimension

        if len(self.spacing) == 0:
            self.spacing += [
                1.0,
            ] * dimension

        if len(self.direction) == 0:
            self.direction = np.eye(dimension).astype(np.float64)

        if len(self.size) == 0:
            self.size += [
                1,
            ] * dimension

        if self.bufferedRegion is None:
            size = _buffered_region_size(self.data, dimension)
            if size is None:
                # A copy, so the buffered region does not track subsequent
                # changes to the largest possible region
                size = list(self.size)
            self.bufferedRegion = ImageRegion(
                index=[
                    0,
                ]
                * dimension,
                size=size,
            )

    def __setattr__(self, name, value):
        # Dicts, e.g. from JSON, are converted however they are assigned
        if name == "imageType" and isinstance(value, dict):
            value = ImageType(**value)
        elif name == "bufferedRegion" and isinstance(value, dict):
            value = ImageRegion(**value)

        super().__setattr__(name, value)

        # The data buffer holds the buffered region -- keep the region
        # consistent when data is assigned after construction.
        if name == "data" and value is not None:
            buffered_region = getattr(self, "bufferedRegion", None)
            if buffered_region is None:
                return
            size = _buffered_region_size(value, self.imageType.dimension)
            if size is not None and list(buffered_region.size) != size:
                # A new region, so a shallow copy of the image does not modify
                # the region of the image it was copied from
                self.bufferedRegion = ImageRegion(index=list(buffered_region.index), size=size)
