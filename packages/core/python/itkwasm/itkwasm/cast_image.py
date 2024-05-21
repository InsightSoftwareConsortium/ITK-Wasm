from typing import Optional, Union
from dataclasses import asdict
import copy

import numpy as np

from .image import Image, ImageType
from .pixel_types import PixelTypes
from .int_types import IntTypes
from .float_types import FloatTypes


def cast_image(
    input_image: Image,
    pixel_type: Optional[PixelTypes] = None,
    component_type: Optional[Union[IntTypes, FloatTypes]] = None,
) -> Image:
    """Cast an image to another pixel type and / or component type.

    :param input_image: Image to be cast.
    :type  input_image: Image

    :param pixel_type: Pixel type to cast to.
    :type  pixel_Type: Optional[PixelTypes]

    :param component_type: Component type to cast to.
    :type  component_type: Optional[Union[IntTypes, FloatTypes]]

    :return: Cast image. Event if pixel_type or component_type are not specified, a copy is made.
    :rtype:  Image

    """
    output_image_type = ImageType(**asdict(input_image.imageType))

    if pixel_type is not None:
        output_image_type.pixelType = pixel_type
        if pixel_type == PixelTypes.Scalar and output_image_type.components != 1:
            raise ValueError("PixelType Scalar requires components == 1")

    if component_type is not None and component_type != input_image.imageType.componentType:
        output_image_type.componentType = component_type

    output_image = Image(output_image_type)

    output_image.name = input_image.name
    output_image.origin = list(input_image.origin)
    output_image.spacing = list(input_image.spacing)
    output_image.direction = input_image.direction.copy()
    output_image.size = list(input_image.size)
    output_image.metadata = copy.deepcopy(input_image.metadata)

    if input_image.data is not None:
        if output_image_type.componentType == input_image.imageType.componentType:
            output_image.data = input_image.data.copy()
        else:
            component_type = output_image_type.componentType
            if component_type == IntTypes.UInt8:
                output_image.data = input_image.data.astype(np.uint8)
            elif component_type == IntTypes.Int8:
                output_image.data = input_image.data.astype(np.int8)
            elif component_type == IntTypes.UInt16:
                output_image.data = input_image.data.astype(np.uint16)
            elif component_type == IntTypes.Int16:
                output_image.data = input_image.data.astype(np.int16)
            elif component_type == IntTypes.UInt32:
                output_image.data = input_image.data.astype(np.uint32)
            elif component_type == IntTypes.Int32:
                output_image.data = input_image.data.astype(np.int32)
            elif component_type == IntTypes.UInt64:
                output_image.data = input_image.data.astype(np.uint64)
            elif component_type == IntTypes.Int64:
                output_image.data = input_image.data.astype(np.int64)
            elif component_type == FloatTypes.Float32:
                output_image.data = input_image.data.astype(np.float32)
            elif component_type == FloatTypes.Float64:
                output_image.data = input_image.data.astype(np.float64)
            else:
                raise ValueError("Unsupported component type")

    return output_image
