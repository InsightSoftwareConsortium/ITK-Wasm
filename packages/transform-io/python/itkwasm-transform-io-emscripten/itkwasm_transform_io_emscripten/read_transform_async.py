import os
from typing import Optional, Union
from pathlib import Path

from itkwasm import (
    TransformList,
    BinaryFile,
)

from .js_package import js_package

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)

from .extension_to_transform_io import extension_to_transform_io
from .transform_io_index import transform_io_index

async def read_transform_async(
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
) -> TransformList:
    """Read an transform file format and convert it to the itk-wasm file format

    :param serialized_transform: Input transform serialized in the file format
    :type  serialized_transform: os.PathLike

    :param float_parameters: Use float for the parameter value type. The default is double.
    :type  float_parameters: bool

    :return: Output transform
    :rtype:  TransformList
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if float_parameters:
        kwargs["floatParameters"] = to_js(float_parameters)

    extension = ''.join(Path(serialized_transform).suffixes)

    io = None
    if extension in extension_to_transform_io:
        func = f"{extension_to_transform_io[extension]}ReadTransform"
        io = getattr(js_module, func)
    else:
        for ioname in transform_io_index:
            func = f"{ioname}ReadTransform"
            io = getattr(js_module, func)
            outputs = await io(to_js(BinaryFile(serialized_transform)), webWorker=web_worker, noCopy=True, **kwargs)
            outputs_object_map = outputs.as_object_map()
            web_worker = outputs_object_map['webWorker']
            js_resources.web_worker = web_worker
            could_read = to_py(outputs_object_map['couldRead'])
            if could_read:
                transform = to_py(outputs_object_map['transform'])
                return transform

    if io is None:
        raise RuntimeError(f"Could not find an transform reader for {extension}")

    outputs = await io(to_js(BinaryFile(serialized_transform)), webWorker=web_worker, noCopy=True, **kwargs)
    outputs_object_map = outputs.as_object_map()
    web_worker = outputs_object_map['webWorker']
    could_read = to_py(outputs_object_map['couldRead'])

    if not could_read:
        raise RuntimeError(f"Could not read {serialized_transform}")

    js_resources.web_worker = web_worker

    transform = to_py(outputs_object_map['transform'])

    return transform

async def transformread_async(
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
) -> TransformList:
    return await read_transform_async(serialized_transform, float_parameters=float_parameters)

transformread_async.__doc__ = f"""{read_transform_async.__doc__}
    Alias for read_transform_async.
    """
