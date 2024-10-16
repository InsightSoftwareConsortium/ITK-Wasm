import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    PointSet,
)

async def write_point_set_async(
    point_set: PointSet,
    serialized_point_set: str,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    """Write an ITK-Wasm file format converted to a point set file format.

    :param point_set: Input point set
    :type  point_set: PointSet

    :param serialized_point_set: Output point set serialized in the file format.
    :type  serialized_point_set: str

    :param information_only: Only write point set metadata -- do not write pixel data.
    :type  information_only: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool
    """
    func = environment_dispatch("itkwasm_mesh_io", "write_point_set_async")
    await func(point_set, serialized_point_set, information_only=information_only, use_compression=use_compression)
    return

async def pointsetwrite_async(
    point_set: PointSet,
    serialized_point_set: os.PathLike,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    return await write_point_set_async(point_set, serialized_point_set, information_only=information_only, use_compression=use_compression)

pointsetwrite_async.__doc__ = f"""{write_point_set_async.__doc__}
    Alias for write_point_set.
    """