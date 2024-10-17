import os
from typing import Optional, Union

from itkwasm import (
    environment_dispatch,
    PointSet,
)

async def read_point_set_async(
    serialized_point_set: os.PathLike,
    information_only: bool = False,
) -> PointSet:
    """Read a point set file format and convert it to the ITK-Wasm file format.

    :param serialized_point_set: Input point_set serialized in the file format
    :type  serialized_point_set: os.PathLike

    :param information_only: Only read point_set metadata -- do not read pixel data.
    :type  information_only: bool

    :return: Output point_set
    :rtype:  PointSet
    """
    func = environment_dispatch("itkwasm_mesh_io", "read_point_set_async")
    output = await func(serialized_point_set, information_only=information_only)
    return output

async def pointsetread_async(
    serialized_point_set: os.PathLike,
    information_only: bool = False,
) -> PointSet:
    return await read_point_set_async(serialized_point_set, information_only=information_only)

pointsetread_async.__doc__ = f"""{read_point_set_async.__doc__}
    Alias for read_point_set.
    """