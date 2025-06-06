import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    PointSet,
)

def write_point_set(
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
    func = environment_dispatch("itkwasm_point_set_io", "write_point_set")
    func(point_set, serialized_point_set, information_only=information_only, use_compression=use_compression)
    return

def pointsetwrite(
    point_set: PointSet,
    serialized_point_set: os.PathLike,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    return write_point_set(point_set, serialized_point_set, information_only=information_only, use_compression=use_compression)

pointsetwrite.__doc__ = f"""{write_point_set.__doc__}
    Alias for write_point_set.
    """