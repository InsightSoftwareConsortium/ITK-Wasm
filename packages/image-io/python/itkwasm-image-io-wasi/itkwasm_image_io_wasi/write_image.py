import os
import importlib
from pathlib import Path
from typing import Optional, Union

from itkwasm import Image, PixelTypes, IntTypes, FloatTypes, cast_image

from .extension_to_image_io import extension_to_image_io
from .image_io_index import image_io_index

def write_image(
    image: Image,
    serialized_image: os.PathLike,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    """Write an itk-wasm Image to an image file format.

    :param image: Input image
    :type  image: Image

    :param serialized_image: Output image serialized in the file format.
    :type  serialized_image: str

    :param information_only: Only write image metadata -- do not write pixel data.
    :type  information_only: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool

    :param serialized_image: Input image serialized in the file format
    :type  serialized_image: os.PathLike
    """
    extension = ''.join(Path(serialized_image).suffixes)

    io = None
    if extension in extension_to_image_io:
        func = f"{extension_to_image_io[extension]}_write_image"
        mod_name = f"itkwasm_image_io_wasi.{func}"
        mod = importlib.import_module(mod_name)
        io = getattr(mod, func)
    else:
        for ioname in image_io_index:
            func = f"{ioname}_write_image"
            mod_name = f"itkwasm_image_io_wasi.{func}"
            mod = importlib.import_module(mod_name)
            io = getattr(mod, func)
            could_write = io(image, serialized_image, information_only=information_only, use_compression=use_compression)
            if could_write:
                return

    if io is None:
        raise RuntimeError(f"Could not find an image writer for {extension}")

    could_write = io(image, serialized_image, information_only=information_only, use_compression=use_compression)
    if not could_write:
        raise RuntimeError(f"Could not write {serialized_image}")

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