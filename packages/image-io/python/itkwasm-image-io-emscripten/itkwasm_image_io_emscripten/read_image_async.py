import os
from typing import Optional, Union
from pathlib import Path

from itkwasm import (
    Image,
    PixelTypes,
    IntTypes,
    FloatTypes,
    BinaryFile,
    cast_image,
)

from .js_package import js_package

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)

from .extension_to_image_io import extension_to_image_io
from .image_io_index import image_io_index

async def read_image_async(
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
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if information_only:
        kwargs["informationOnly"] = to_js(information_only)

    extension = ''.join(Path(serialized_image).suffixes)

    io = None
    if extension in extension_to_image_io:
        func = f"{extension_to_image_io[extension]}ReadImage"
        io = getattr(js_module, func)
    else:
        for ioname in image_io_index:
            func = f"{ioname}ReadImage"
            io = getattr(js_module, func)
            outputs = await io(to_js(BinaryFile(serialized_image)), webWorker=web_worker, noCopy=True, **kwargs)
            outputs_object_map = outputs.as_object_map()
            web_worker = outputs_object_map['webWorker']
            js_resources.web_worker = web_worker
            could_read = to_py(outputs_object_map['couldRead'])
            if could_read:
                image = to_py(outputs_object_map['image'])
                if pixel_type or component_type:
                    image = cast_image(image, pixel_type=pixel_type, component_type=component_type)
                return image

    if io is None:
        raise RuntimeError(f"Could not find an image reader for {extension}")

    outputs = await io(to_js(BinaryFile(serialized_image)), webWorker=web_worker, noCopy=True, **kwargs)
    outputs_object_map = outputs.as_object_map()
    web_worker = outputs_object_map['webWorker']
    could_read = to_py(outputs_object_map['couldRead'])

    if not could_read:
        raise RuntimeError(f"Could not read {serialized_image}")

    js_resources.web_worker = web_worker

    image = to_py(outputs_object_map['image'])

    if pixel_type or component_type:
        image = cast_image(image, pixel_type=pixel_type, component_type=component_type)
    return image

async def imread_async(
    serialized_image: os.PathLike,
    information_only: bool = False,
    pixel_type: Optional[PixelTypes]=None,
    component_type: Optional[Union[IntTypes, FloatTypes]]=None,
) -> Image:
    return await read_image_async(serialized_image, information_only=information_only, pixel_type=pixel_type, component_type=component_type)

imread_async.__doc__ = f"""{read_image_async.__doc__}
    Alias for read_image_async.
    """
