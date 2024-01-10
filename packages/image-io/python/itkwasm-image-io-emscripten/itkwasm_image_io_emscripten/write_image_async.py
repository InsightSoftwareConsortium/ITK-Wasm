import os
import importlib
from pathlib import Path
from typing import Optional, Union

from itkwasm import Image, PixelTypes, IntTypes, FloatTypes, BinaryFile

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)

from .js_package import js_package

from .extension_to_image_io import extension_to_image_io
from .image_io_index import image_io_index

async def write_image_async(
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
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if information_only:
        kwargs["informationOnly"] = to_js(information_only)
    if use_compression:
        kwargs["useCompression"] = to_js(use_compression)

    extension = ''.join(Path(serialized_image).suffixes)

    io = None
    if extension in extension_to_image_io:
        func = f"{extension_to_image_io[extension]}WriteImage"
        io = getattr(js_module, func)
    else:
        for ioname in image_io_index:
            func = f"{ioname}WriteImage"
            io = getattr(js_module, func)
            outputs = await io(to_js(image), to_js(serialized_image), webWorker=web_worker, noCopy=True, **kwargs)
            outputs_object_map = outputs.as_object_map()
            web_worker = outputs_object_map['webWorker']
            js_resources.web_worker = web_worker
            could_write = to_py(outputs_object_map['couldWrite'])
            if could_write:
                to_py(outputs_object_map['serializedImage'])
                return

    if io is None:
        raise RuntimeError(f"Could not find an image writer for {extension}")

    outputs = await io(to_js(image), to_js(serialized_image), webWorker=web_worker, noCopy=True, **kwargs)
    outputs_object_map = outputs.as_object_map()
    web_worker = outputs_object_map['webWorker']
    js_resources.web_worker = web_worker
    could_write = to_py(outputs_object_map['couldWrite'])

    if not could_write:
        raise RuntimeError(f"Could not write {serialized_image}")

    to_py(outputs_object_map['serializedImage'])

async def imwrite_async(
    image: Image,
    serialized_image: os.PathLike,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    return write_image_async(image, serialized_image, information_only=information_only, use_compression=use_compression)

imwrite_async.__doc__ = f"""{write_image_async.__doc__}
    Alias for write_image.
    """
