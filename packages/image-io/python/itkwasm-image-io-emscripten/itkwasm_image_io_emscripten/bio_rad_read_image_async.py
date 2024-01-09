# Generated file. To retain edits, remove this comment.

from pathlib import Path
import os
from typing import Dict, Tuple, Optional, List, Any

from .js_package import js_package

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)
from itkwasm import (
    InterfaceTypes,
    BinaryFile,
    Image,
)

async def bio_rad_read_image_async(
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
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if information_only:
        kwargs["informationOnly"] = to_js(information_only)

    outputs = await js_module.bioRadReadImage(to_js(BinaryFile(serialized_image)), webWorker=web_worker, noCopy=True, **kwargs)

    output_web_worker = None
    output_list = []
    outputs_object_map = outputs.as_object_map()
    for output_name in outputs.object_keys():
        if output_name == 'webWorker':
            output_web_worker = outputs_object_map[output_name]
        else:
            output_list.append(to_py(outputs_object_map[output_name]))

    js_resources.web_worker = output_web_worker

    if len(output_list) == 1:
        return output_list[0]
    return tuple(output_list)
