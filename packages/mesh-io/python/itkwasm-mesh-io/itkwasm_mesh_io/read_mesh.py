import os
from typing import Optional, Union

from itkwasm import (
    environment_dispatch,
    Mesh,
)

def read_mesh(
    serialized_mesh: os.PathLike,
    information_only: bool = False,
) -> Mesh:
    """Read a mesh file format and convert it to the ITK-Wasm file format

    :param serialized_mesh: Input mesh serialized in the file format
    :type  serialized_mesh: os.PathLike

    :param information_only: Only read mesh metadata -- do not read pixel data.
    :type  information_only: bool

    :return: Output mesh
    :rtype:  Mesh
    """
    func = environment_dispatch("itkwasm_mesh_io", "read_mesh")
    output = func(serialized_mesh, information_only=information_only)
    return output

def meshread(
    serialized_mesh: os.PathLike,
    information_only: bool = False,
) -> Mesh:
    return read_mesh(serialized_mesh, information_only=information_only)

meshread.__doc__ = f"""{read_mesh.__doc__}
    Alias for read_mesh.
    """