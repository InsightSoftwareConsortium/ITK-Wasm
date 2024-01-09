import os
from typing import Optional, Union
from pathlib import Path

from itkwasm import (
    Mesh,
    BinaryFile,
)

from .js_package import js_package

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)

from .extension_to_mesh_io import extension_to_mesh_io
from .mesh_io_index import mesh_io_index

async def read_mesh_async(
    serialized_mesh: os.PathLike,
    information_only: bool = False,
) -> Mesh:
    """Read an mesh file format and convert it to the itk-wasm file format

    :param serialized_mesh: Input mesh serialized in the file format
    :type  serialized_mesh: os.PathLike

    :param information_only: Only read mesh metadata -- do not read pixel data.
    :type  information_only: bool

    :return: Output mesh
    :rtype:  Mesh
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if information_only:
        kwargs["informationOnly"] = to_js(information_only)

    extension = ''.join(Path(serialized_mesh).suffixes)

    io = None
    if extension in extension_to_mesh_io:
        func = f"{extension_to_mesh_io[extension]}ReadMesh"
        io = getattr(js_module, func)
    else:
        for ioname in mesh_io_index:
            func = f"{ioname}ReadMesh"
            io = getattr(js_module, func)
            outputs = await io(to_js(BinaryFile(serialized_mesh)), webWorker=web_worker, noCopy=True, **kwargs)
            outputs_object_map = outputs.as_object_map()
            web_worker = outputs_object_map['webWorker']
            js_resources.web_worker = web_worker
            could_read = to_py(outputs_object_map['couldRead'])
            if could_read:
                mesh = to_py(outputs_object_map['mesh'])
                return mesh

    if io is None:
        raise RuntimeError(f"Could not find an mesh reader for {extension}")

    outputs = await io(to_js(BinaryFile(serialized_mesh)), webWorker=web_worker, noCopy=True, **kwargs)
    outputs_object_map = outputs.as_object_map()
    web_worker = outputs_object_map['webWorker']
    could_read = to_py(outputs_object_map['couldRead'])

    if not could_read:
        raise RuntimeError(f"Could not read {serialized_mesh}")

    js_resources.web_worker = web_worker

    mesh = to_py(outputs_object_map['mesh'])

    return mesh

async def meshread_async(
    serialized_mesh: os.PathLike,
    information_only: bool = False,
) -> Mesh:
    return await read_mesh_async(serialized_mesh, information_only=information_only)

meshread_async.__doc__ = f"""{read_mesh_async.__doc__}
    Alias for read_mesh_async.
    """
