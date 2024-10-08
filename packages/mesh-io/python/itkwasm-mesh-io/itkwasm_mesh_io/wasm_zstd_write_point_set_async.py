# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    PointSet,
    BinaryFile,
)

async def wasm_zstd_write_point_set_async(
    point_set: PointSet,
    serialized_point_set: str,
    information_only: bool = False,
    use_compression: bool = False,
    binary_file_type: bool = False,
) -> Tuple[Any]:
    """Write an ITK-Wasm file format converted to a point set file format

    :param point_set: Input point set
    :type  point_set: PointSet

    :param serialized_point_set: Output point set
    :type  serialized_point_set: str

    :param information_only: Only write point set metadata -- do not write pixel data.
    :type  information_only: bool

    :param use_compression: Use compression in the written file, if supported
    :type  use_compression: bool

    :param binary_file_type: Use a binary file type in the written file, if supported
    :type  binary_file_type: bool

    :return: Whether the input could be written. If false, the output mesh is not valid.
    :rtype:  Any
    """
    func = environment_dispatch("itkwasm_mesh_io", "wasm_zstd_write_point_set_async")
    output = await func(point_set, serialized_point_set, information_only=information_only, use_compression=use_compression, binary_file_type=binary_file_type)
    return output
