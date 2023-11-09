import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    Image,
)

def write_image(
    image: Image,
    serialized_image: str,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    """Write an itk-wasm file format converted to an image file format

    :param image: Input image
    :type  image: Image

    :param serialized_image: Output image serialized in the file format.
    :type  serialized_image: str

    :param information_only: Only write image metadata -- do not write pixel data.
    :type  information_only: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool
    """
    func = environment_dispatch("itkwasm_image_io", "write_image")
    func(image, serialized_image, information_only=information_only, use_compression=use_compression)
    return

def imwrite(
    image: Image,
    serialized_image: os.PathLike,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    return write_image(image, serialized_image, information_only=information_only, use_compression=use_compression)

imwrite.__doc__ = f"""{write_image.__doc__}
    Alias for write_image.
    """