import os
import importlib
from pathlib import Path
from typing import Optional, Union

from itkwasm import PointSet, PixelTypes, IntTypes, FloatTypes, BinaryFile

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)

from .js_package import js_package

from .extension_to_point_set_io import extension_to_point_set_io
from .point_set_io_index import point_set_io_index

async def write_point_set_async(
    point_set: PointSet,
    serialized_point_set: os.PathLike,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    """Write an ITK-Wasm PointSet to a point set file format.

    :param point_set: Input point set
    :type  point_set: PointSet

    :param serialized_point_set: Output point set serialized in the file format.
    :type  serialized_point_set: str

    :param information_only: Only write point set metadata -- do not write pixel data.
    :type  information_only: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool

    :param serialized_point_set: Input point set serialized in the file format
    :type  serialized_point_set: os.PathLike
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if information_only:
        kwargs["informationOnly"] = to_js(information_only)
    if use_compression:
        kwargs["useCompression"] = to_js(use_compression)

    extension = ''.join(Path(serialized_point_set).suffixes)

    io = None
    if extension in extension_to_point_set_io:
        func = f"{extension_to_point_set_io[extension]}WritePointSet"
        io = getattr(js_module, func)
    else:
        for ioname in point_set_io_index:
            func = f"{ioname}WritePointSet"
            io = getattr(js_module, func)
            outputs = await io(to_js(point_set), to_js(serialized_point_set), webWorker=web_worker, noCopy=True, **kwargs)
            outputs_object_map = outputs.as_object_map()
            web_worker = outputs_object_map['webWorker']
            js_resources.web_worker = web_worker
            could_write = to_py(outputs_object_map['couldWrite'])
            if could_write:
                to_py(outputs_object_map['serializedPointSet'])
                return

    if io is None:
        raise RuntimeError(f"Could not find an point_set writer for {extension}")

    outputs = await io(to_js(point_set), to_js(serialized_point_set), webWorker=web_worker, noCopy=True, **kwargs)
    outputs_object_map = outputs.as_object_map()
    web_worker = outputs_object_map['webWorker']
    js_resources.web_worker = web_worker
    could_write = to_py(outputs_object_map['couldWrite'])

    if not could_write:
        raise RuntimeError(f"Could not write {serialized_point_set}")

    to_py(outputs_object_map['serializedPointSet'])

async def pointsetwrite_async(
    point_set: PointSet,
    serialized_point_set: os.PathLike,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    return write_point_set_async(point_set, serialized_point_set, information_only=information_only, use_compression=use_compression)

pointsetwrite_async.__doc__ = f"""{write_point_set_async.__doc__}
    Alias for write_point_set.
    """
