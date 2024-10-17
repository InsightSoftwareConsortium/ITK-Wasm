import os
from typing import Optional, Union

from itkwasm import (
    environment_dispatch,
    PointSet,
)

def read_point_set(
    serialized_point_set: os.PathLike,
    information_only: bool = False,
) -> PointSet:
    """Read a point set file format and convert it to the ITK-Wasm file format.

    :param serialized_point_set: Input point_set serialized in the file format
    :type  serialized_point_set: os.PathLike

    :param information_only: Only read point set metadata -- do not read pixel data.
    :type  information_only: bool

    :return: Output point set
    :rtype:  PointSet
    """
    func = environment_dispatch("itkwasm_point_set_io", "read_point_set")
    output = func(serialized_point_set, information_only=information_only)
    return output

def pointsetread(
    serialized_point_set: os.PathLike,
    information_only: bool = False,
) -> PointSet:
    return read_point_set(serialized_point_set, information_only=information_only)

pointsetread.__doc__ = f"""{read_point_set.__doc__}
    Alias for read_point_set.
    """