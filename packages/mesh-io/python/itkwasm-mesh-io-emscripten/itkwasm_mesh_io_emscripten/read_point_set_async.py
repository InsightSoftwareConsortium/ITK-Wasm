import os
from typing import Optional, Union
from pathlib import Path

from itkwasm import (
    PointSet,
    BinaryFile,
)

from .js_package import js_package

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)

from .extension_to_point_set_io import extension_to_point_set_io
from .point_set_io_index import point_set_io_index

async def read_point_set_async(
    serialized_point_set: os.PathLike,
    information_only: bool = False,
) -> PointSet:
    """Read an point set file format and convert it to the ITK-Wasm file format.

    :param serialized_point_set: Input point set serialized in the file format
    :type  serialized_point_set: os.PathLike

    :param information_only: Only read point set metadata -- do not read pixel data.
    :type  information_only: bool

    :return: Output point set
    :rtype:  PointSet
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if information_only:
        kwargs["informationOnly"] = to_js(information_only)

    extension = ''.join(Path(serialized_point_set).suffixes)

    io = None
    if extension in extension_to_point_set_io:
        func = f"{extension_to_point_set_io[extension]}ReadPointSet"
        io = getattr(js_module, func)
    else:
        for ioname in point_set_io_index:
            func = f"{ioname}ReadPointSet"
            io = getattr(js_module, func)
            outputs = await io(to_js(BinaryFile(serialized_point_set)), webWorker=web_worker, noCopy=True, **kwargs)
            outputs_object_map = outputs.as_object_map()
            web_worker = outputs_object_map['webWorker']
            js_resources.web_worker = web_worker
            could_read = to_py(outputs_object_map['couldRead'])
            if could_read:
                point_set = to_py(outputs_object_map['pointSet'])
                return point_set

    if io is None:
        raise RuntimeError(f"Could not find an point_set reader for {extension}")

    outputs = await io(to_js(BinaryFile(serialized_point_set)), webWorker=web_worker, noCopy=True, **kwargs)
    outputs_object_map = outputs.as_object_map()
    web_worker = outputs_object_map['webWorker']
    could_read = to_py(outputs_object_map['couldRead'])

    if not could_read:
        raise RuntimeError(f"Could not read {serialized_point_set}")

    js_resources.web_worker = web_worker

    point_set = to_py(outputs_object_map['pointSet'])

    return point_set

async def pointsetread_async(
    serialized_point_set: os.PathLike,
    information_only: bool = False,
) -> PointSet:
    return await read_point_set_async(serialized_point_set, information_only=information_only)

pointsetread_async.__doc__ = f"""{read_point_set_async.__doc__}
    Alias for read_point_set_async.
    """
