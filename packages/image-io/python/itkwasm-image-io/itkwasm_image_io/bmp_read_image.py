# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    BinaryFile,
    Image,
)

def bmp_read_image(
    serialized_image: os.PathLike,
    information_only: bool = False,
) -> Tuple[Any, Image]:
    """Read an image file format and convert it to the itk-wasm file format

    :param serialized_image: Input image serialized in the file format
    :type  serialized_image: os.PathLike

    :param information_only: Only read image metadata -- do not read pixel data.
    :type  information_only: bool

    :return: Whether the input could be read. If false, the output image is not valid.
    :rtype:  Any

    :return: Output image
    :rtype:  Image
    """
    func = environment_dispatch("itkwasm_image_io", "bmp_read_image")
    output = func(serialized_image, information_only=information_only)
    return output
