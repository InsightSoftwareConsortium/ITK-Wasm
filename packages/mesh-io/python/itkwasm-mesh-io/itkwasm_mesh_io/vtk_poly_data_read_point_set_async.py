# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    BinaryFile,
    PointSet,
)

async def vtk_poly_data_read_point_set_async(
    serialized_point_set: os.PathLike,
    information_only: bool = False,
) -> Tuple[Any, PointSet]:
    """Read a point set file format and convert it to the itk-wasm file format

    :param serialized_point_set: Input point set serialized in the file format
    :type  serialized_point_set: os.PathLike

    :param information_only: Only read point set metadata -- do not read pixel data.
    :type  information_only: bool

    :return: Whether the input could be read. If false, the output point set is not valid.
    :rtype:  Any

    :return: Output point set
    :rtype:  PointSet
    """
    func = environment_dispatch("itkwasm_mesh_io", "vtk_poly_data_read_point_set_async")
    output = await func(serialized_point_set, information_only=information_only)
    return output
