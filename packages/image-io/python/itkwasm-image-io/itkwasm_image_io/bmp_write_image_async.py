# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    Image,
    BinaryFile,
)

async def bmp_write_image_async(
    image: Image,
    serialized_image: str,
    information_only: bool = False,
    use_compression: bool = False,
) -> Tuple[Any]:
    """Write an itk-wasm file format converted to an image file format

    :param image: Input image
    :type  image: Image

    :param serialized_image: Output image serialized in the file format.
    :type  serialized_image: str

    :param information_only: Only write image metadata -- do not write pixel data.
    :type  information_only: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool

    :return: Whether the input could be written. If false, the output image is not valid.
    :rtype:  Any
    """
    func = environment_dispatch("itkwasm_image_io", "bmp_write_image_async")
    output = await func(image, serialized_image, information_only=information_only, use_compression=use_compression)
    return output
