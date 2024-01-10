import os
import importlib
from pathlib import Path
from typing import Optional, Union

from itkwasm import Mesh, PixelTypes, IntTypes, FloatTypes, BinaryFile

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)

from .js_package import js_package

from .extension_to_mesh_io import extension_to_mesh_io
from .mesh_io_index import mesh_io_index

async def write_mesh_async(
    mesh: Mesh,
    serialized_mesh: os.PathLike,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    """Write an itk-wasm Mesh to an mesh file format.

    :param mesh: Input mesh
    :type  mesh: Mesh

    :param serialized_mesh: Output mesh serialized in the file format.
    :type  serialized_mesh: str

    :param information_only: Only write mesh metadata -- do not write pixel data.
    :type  information_only: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool

    :param serialized_mesh: Input mesh serialized in the file format
    :type  serialized_mesh: os.PathLike
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if information_only:
        kwargs["informationOnly"] = to_js(information_only)
    if use_compression:
        kwargs["useCompression"] = to_js(use_compression)

    extension = ''.join(Path(serialized_mesh).suffixes)

    io = None
    if extension in extension_to_mesh_io:
        func = f"{extension_to_mesh_io[extension]}WriteMesh"
        io = getattr(js_module, func)
    else:
        for ioname in mesh_io_index:
            func = f"{ioname}WriteMesh"
            io = getattr(js_module, func)
            outputs = await io(to_js(mesh), to_js(serialized_mesh), webWorker=web_worker, noCopy=True, **kwargs)
            outputs_object_map = outputs.as_object_map()
            web_worker = outputs_object_map['webWorker']
            js_resources.web_worker = web_worker
            could_write = to_py(outputs_object_map['couldWrite'])
            if could_write:
                to_py(outputs_object_map['serializedMesh'])
                return

    if io is None:
        raise RuntimeError(f"Could not find an mesh writer for {extension}")

    outputs = await io(to_js(mesh), to_js(serialized_mesh), webWorker=web_worker, noCopy=True, **kwargs)
    outputs_object_map = outputs.as_object_map()
    web_worker = outputs_object_map['webWorker']
    js_resources.web_worker = web_worker
    could_write = to_py(outputs_object_map['couldWrite'])

    if not could_write:
        raise RuntimeError(f"Could not write {serialized_mesh}")

    to_py(outputs_object_map['serializedMesh'])

async def meshwrite_async(
    mesh: Mesh,
    serialized_mesh: os.PathLike,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    return write_mesh_async(mesh, serialized_mesh, information_only=information_only, use_compression=use_compression)

meshwrite_async.__doc__ = f"""{write_mesh_async.__doc__}
    Alias for write_mesh.
    """
