import os
import importlib
from pathlib import Path
from typing import Optional, Union

from itkwasm import Image, PixelTypes, IntTypes, FloatTypes, cast_image

from .extension_to_image_io import extension_to_image_io
from .image_io_index import image_io_index

def read_image(
    serialized_image: os.PathLike,
    information_only: bool = False,
    pixel_type: Optional[PixelTypes]=None,
    component_type: Optional[Union[IntTypes, FloatTypes]]=None,
) -> Image:
    """Read an image file format and convert it to the itk-wasm file format.

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
    extension = ''.join(Path(serialized_image).suffixes)

    io = None
    if extension in extension_to_image_io:
        func = f"{extension_to_image_io[extension]}_read_image"
        mod_name = f"itkwasm_image_io_wasi.{func}"
        mod = importlib.import_module(mod_name)
        io = getattr(mod, func)
    else:
        for ioname in image_io_index:
            func = f"{ioname}_read_image"
            mod_name = f"itkwasm_image_io_wasi.{func}"
            mod = importlib.import_module(mod_name)
            io = getattr(mod, func)
            could_read, image = io(serialized_image, information_only=information_only)
            if could_read:
                if pixel_type or component_type:
                    image = cast_image(image, pixel_type=pixel_type, component_type=component_type)
                return image

    if io is None:
        raise RuntimeError(f"Could not find an image reader for {extension}")

    could_read, image = io(serialized_image, information_only=information_only)
    if not could_read:
        raise RuntimeError(f"Could not read {serialized_image}")

    if pixel_type or component_type:
        image = cast_image(image, pixel_type=pixel_type, component_type=component_type)
    return image


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