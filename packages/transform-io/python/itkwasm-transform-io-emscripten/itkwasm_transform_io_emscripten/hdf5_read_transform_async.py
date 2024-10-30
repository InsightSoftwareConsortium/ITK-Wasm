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
    Transform,
)

async def hdf5_read_transform_async(
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
) -> Tuple[Any, Transform]:
    """Read an transform file format and convert it to the ITK-Wasm transform file format

    :param serialized_transform: Input transform serialized in the file format
    :type  serialized_transform: os.PathLike

    :param float_parameters: Use float for the parameter value type. The default is double.
    :type  float_parameters: bool

    :return: Whether the input could be read. If false, the output transform is not valid.
    :rtype:  Any

    :return: Output transform
    :rtype:  Transform
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if float_parameters:
        kwargs["floatParameters"] = to_js(float_parameters)

    outputs = await js_module.hdf5ReadTransform(to_js(BinaryFile(serialized_transform)), webWorker=web_worker, noCopy=True, **kwargs)

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
