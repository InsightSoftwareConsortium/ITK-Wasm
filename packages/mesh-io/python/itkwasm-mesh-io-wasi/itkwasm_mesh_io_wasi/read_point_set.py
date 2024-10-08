import os
import importlib
from pathlib import Path

from itkwasm import PointSet

from .extension_to_point_set_io import extension_to_point_set_io
from .point_set_io_index import point_set_io_index

def read_point_set(
    serialized_point_set: os.PathLike,
    information_only: bool = False,
) -> PointSet:
    """Read a point set file format and convert it to the ITK-Wasm file format.

    :param serialized_point_set: Input point set serialized in the file format
    :type  serialized_point_set: os.PathLike

    :param information_only: Only read point set metadata -- do not read pixel data.
    :type  information_only: bool

    :return: Output point set
    :rtype:  PointSet
    """
    extension = ''.join(Path(serialized_point_set).suffixes)

    io = None
    if extension in extension_to_point_set_io:
        func = f"{extension_to_point_set_io[extension]}_read_point_set"
        mod_name = f"itkwasm_mesh_io_wasi.{func}"
        mod = importlib.import_module(mod_name)
        io = getattr(mod, func)
    else:
        for ioname in point_set_io_index:
            func = f"{ioname}_read_point_set"
            mod_name = f"itkwasm_mesh_io_wasi.{func}"
            mod = importlib.import_module(mod_name)
            io = getattr(mod, func)
            could_read, point_set = io(serialized_point_set, information_only=information_only)
            if could_read:
                return point_set

    if io is None:
        raise RuntimeError(f"Could not find an point set reader for {extension}")

    could_read, point_set = io(serialized_point_set, information_only=information_only)
    if not could_read:
        raise RuntimeError(f"Could not read {serialized_point_set}")

    return point_set


def pointsetread(
    serialized_point_set: os.PathLike,
    information_only: bool = False,
) -> PointSet:
    return read_point_set(serialized_point_set, information_only=information_only)

pointsetread.__doc__ = f"""{read_point_set.__doc__}
    Alias for read_point_set.
    """