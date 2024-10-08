import os
from typing import Optional, Union

from itkwasm import (
    environment_dispatch,
    Mesh,
)

async def read_mesh_async(
    serialized_mesh: os.PathLike,
    information_only: bool = False,
) -> Mesh:
    """Read an mes file format and convert it to the ITK-Wasm file format.

    :param serialized_mesh: Input mesh serialized in the file format
    :type  serialized_mesh: os.PathLike

    :param information_only: Only read mesh metadata -- do not read pixel data.
    :type  information_only: bool

    :return: Output mesh
    :rtype:  Mesh
    """
    func = environment_dispatch("itkwasm_mesh_io", "read_mesh_async")
    output = await func(serialized_mesh, information_only=information_only)
    return output

async def meshread_async(
    serialized_mesh: os.PathLike,
    information_only: bool = False,
) -> Mesh:
    return await read_mesh_async(serialized_mesh, information_only=information_only)

meshread_async.__doc__ = f"""{read_mesh_async.__doc__}
    Alias for read_mesh.
    """