import os
import importlib
from pathlib import Path
from typing import Optional, Union

from itkwasm import TransformList, PixelTypes, IntTypes, FloatTypes, BinaryFile

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)

from .js_package import js_package

from .extension_to_transform_io import extension_to_transform_io
from .transform_io_index import transform_io_index

async def write_transform_async(
    transform: TransformList,
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
    use_compression: bool = False,
) -> None:
    """Write an itk-wasm TransformList to an transform file format.

    :param transform: Input transform
    :type  transform: TransformList

    :param serialized_transform: Output transform serialized in the file format.
    :type  serialized_transform: str

    :param float_parameters: Use float for the parameter value type. The default is double.
    :type  float_parameters: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool

    :param serialized_transform: Input transform serialized in the file format
    :type  serialized_transform: os.PathLike
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if float_parameters:
        kwargs["floatParameters"] = to_js(float_parameters)
    if use_compression:
        kwargs["useCompression"] = to_js(use_compression)

    extension = ''.join(Path(serialized_transform).suffixes)

    io = None
    if extension in extension_to_transform_io:
        func = f"{extension_to_transform_io[extension]}WriteTransform"
        io = getattr(js_module, func)
    else:
        for ioname in transform_io_index:
            func = f"{ioname}WriteTransform"
            io = getattr(js_module, func)
            outputs = await io(to_js(transform), to_js(serialized_transform), webWorker=web_worker, noCopy=True, **kwargs)
            outputs_object_map = outputs.as_object_map()
            web_worker = outputs_object_map['webWorker']
            js_resources.web_worker = web_worker
            could_write = to_py(outputs_object_map['couldWrite'])
            if could_write:
                to_py(outputs_object_map['serializedTransform'])
                return

    if io is None:
        raise RuntimeError(f"Could not find an transform writer for {extension}")

    outputs = await io(to_js(transform), to_js(serialized_transform), webWorker=web_worker, noCopy=True, **kwargs)
    outputs_object_map = outputs.as_object_map()
    web_worker = outputs_object_map['webWorker']
    js_resources.web_worker = web_worker
    could_write = to_py(outputs_object_map['couldWrite'])

    if not could_write:
        raise RuntimeError(f"Could not write {serialized_transform}")

    to_py(outputs_object_map['serializedTransform'])

async def transformwrite_async(
    transform: TransformList,
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
    use_compression: bool = False,
) -> None:
    return write_transform_async(transform, serialized_transform, float_parameters=float_parameters, use_compression=use_compression)

transformwrite_async.__doc__ = f"""{write_transform_async.__doc__}
    Alias for write_transform.
    """
