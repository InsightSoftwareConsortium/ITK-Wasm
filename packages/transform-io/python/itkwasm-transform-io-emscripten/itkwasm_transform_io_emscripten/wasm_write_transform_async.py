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
    Transform,
    BinaryFile,
)

async def wasm_write_transform_async(
    transform: Transform,
    serialized_transform: str,
    float_parameters: bool = False,
    use_compression: bool = False,
) -> Tuple[Any]:
    """Write an ITK-Wasm transform file format converted to a transform file format

    :param transform: Input transform
    :type  transform: Transform

    :param serialized_transform: Output transform serialized in the file format.
    :type  serialized_transform: str

    :param float_parameters: Use float for the parameter value type. The default is double.
    :type  float_parameters: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool

    :return: Whether the input could be written. If false, the output transform is not valid.
    :rtype:  Any
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if float_parameters:
        kwargs["floatParameters"] = to_js(float_parameters)
    if use_compression:
        kwargs["useCompression"] = to_js(use_compression)

    outputs = await js_module.wasmWriteTransform(to_js(transform), to_js(serialized_transform), webWorker=web_worker, noCopy=True, **kwargs)

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
