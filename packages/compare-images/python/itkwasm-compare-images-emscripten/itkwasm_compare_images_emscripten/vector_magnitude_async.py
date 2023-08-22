# Generated file. To retain edits, remove this comment.

# Generated file. Do not edit.

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
    Image,
)

async def vector_magnitude_async(
    vector_image: Image,
) -> Image:
    """Generate a scalar magnitude image based on the input vector's norm.

    :param vector_image: Input vector image
    :type  vector_image: Image

    :return: Output magnitude image
    :rtype:  Image
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}

    outputs = await js_module.vectorMagnitude(web_worker, to_js(vector_image), **kwargs)

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
