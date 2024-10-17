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
    Mesh,
    BinaryFile,
)

async def swc_write_mesh_async(
    mesh: Mesh,
    serialized_mesh: str,
    information_only: bool = False,
    use_compression: bool = False,
    binary_file_type: bool = False,
) -> Tuple[Any]:
    """Write an itk-wasm file format converted to an mesh file format

    :param mesh: Input mesh
    :type  mesh: Mesh

    :param serialized_mesh: Output mesh
    :type  serialized_mesh: str

    :param information_only: Only write mesh metadata -- do not write pixel data.
    :type  information_only: bool

    :param use_compression: Use compression in the written file, if supported
    :type  use_compression: bool

    :param binary_file_type: Use a binary file type in the written file, if supported
    :type  binary_file_type: bool

    :return: Whether the input could be written. If false, the output mesh is not valid.
    :rtype:  Any
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if information_only:
        kwargs["informationOnly"] = to_js(information_only)
    if use_compression:
        kwargs["useCompression"] = to_js(use_compression)
    if binary_file_type:
        kwargs["binaryFileType"] = to_js(binary_file_type)

    outputs = await js_module.swcWriteMesh(to_js(mesh), to_js(serialized_mesh), webWorker=web_worker, noCopy=True, **kwargs)

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
