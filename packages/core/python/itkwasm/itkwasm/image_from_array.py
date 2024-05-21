from typing import Optional

try:
    from numpy.typing import ArrayLike
except ImportError:
    from numpy import ndarray as ArrayLike

from .image import Image, ImageType
from .to_numpy_array import _dtype_to_component_type

from .pixel_types import PixelTypes


def image_from_array(arr, is_vector: bool = False, image_type: Optional[ImageType] = None) -> Image:
    """Convert a numpy array-like to an itkwasm Image.

    :param arr: Input n-d array
    :type  arr: NumPy ndarray or array-like, e.g. dask.Array or cupy.ndarray

    :param is_vector: Whether the array is a vector image. If True, then a 3D array will be treated as a 2D vector image, otherwise it will be treated as a 3D image.
    :type  is_vector: bool

    :param image_type: Explicitly specify the Image type
    :type  image_type: ImageType

    :return: Output Image
    :rtype : Image where pixel data is a view of the input array and default metadata
    """

    dimension = arr.ndim
    if is_vector:
        dimension -= 1

    if image_type is None:
        image_type = ImageType(
            dimension=dimension,
            componentType=_dtype_to_component_type(arr.dtype),
            pixelType=(PixelTypes.Scalar if not is_vector else PixelTypes.VariableLengthVector),
            components=arr.shape[-1] if is_vector else 1,
        )

    image = Image(imageType=image_type)
    image.size = arr.shape[:dimension][::-1]
    image.data = arr

    return image
