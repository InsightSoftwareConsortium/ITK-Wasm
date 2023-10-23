import os
from typing import Optional, Union

from itkwasm import (
    environment_dispatch,
    Image,
    PixelTypes,
    IntTypes,
    FloatTypes,
)

def read_image(
    serialized_image: os.PathLike,
    information_only: bool = False,
    pixel_type: Optional[PixelTypes]=None,
    component_type: Optional[Union[IntTypes, FloatTypes]]=None,
) -> Image:
    """Read an image file format and convert it to the itk-wasm file format

    :param serialized_image: Input image serialized in the file format
    :type  serialized_image: os.PathLike

    :param information_only: Only read image metadata -- do not read pixel data.
    :type  information_only: bool

    :param pixel_type: Pixel type to cast to.
    :type  pixel_Type: Optional[PixelTypes]

    :param component_type: Component type to cast to.
    :type  component_type: Optional[Union[IntTypes, FloatTypes]]

    :return: Output image
    :rtype:  Image
    """
    func = environment_dispatch("itkwasm_image_io", "read_image")
    output = func(serialized_image, information_only=information_only, pixel_type=pixel_type, component_type=component_type)
    return output

def imread(
    serialized_image: os.PathLike,
    information_only: bool = False,
    pixel_type: Optional[PixelTypes]=None,
    component_type: Optional[Union[IntTypes, FloatTypes]]=None,
) -> Image:
    return read_image(serialized_image, information_only=information_only, pixel_type=pixel_type, component_type=component_type)

imread.__doc__ = f"""{read_image.__doc__}
    Alias for read_image.
    """