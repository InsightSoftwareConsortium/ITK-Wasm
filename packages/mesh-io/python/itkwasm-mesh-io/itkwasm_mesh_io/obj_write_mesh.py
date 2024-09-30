# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    Mesh,
    BinaryFile,
)

def obj_write_mesh(
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
    func = environment_dispatch("itkwasm_mesh_io", "obj_write_mesh")
    output = func(mesh, serialized_mesh, information_only=information_only, use_compression=use_compression, binary_file_type=binary_file_type)
    return output
