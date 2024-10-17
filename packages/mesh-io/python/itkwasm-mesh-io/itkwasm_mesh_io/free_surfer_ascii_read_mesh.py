# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    BinaryFile,
    Mesh,
)

def free_surfer_ascii_read_mesh(
    serialized_mesh: os.PathLike,
    information_only: bool = False,
) -> Tuple[Any, Mesh]:
    """Read a mesh file format and convert it to the itk-wasm file format

    :param serialized_mesh: Input mesh serialized in the file format
    :type  serialized_mesh: os.PathLike

    :param information_only: Only read mesh metadata -- do not read pixel data.
    :type  information_only: bool

    :return: Whether the input could be read. If false, the output mesh is not valid.
    :rtype:  Any

    :return: Output mesh
    :rtype:  Mesh
    """
    func = environment_dispatch("itkwasm_mesh_io", "free_surfer_ascii_read_mesh")
    output = func(serialized_mesh, information_only=information_only)
    return output
