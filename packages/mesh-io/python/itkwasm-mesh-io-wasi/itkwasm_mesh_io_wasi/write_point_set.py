import os
import importlib
from pathlib import Path

from itkwasm import PointSet

from .extension_to_point_set_io import extension_to_point_set_io
from .point_set_io_index import point_set_io_index

def write_point_set(
    point_set: PointSet,
    serialized_point_set: os.PathLike,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    """Write an ITK-Wasm PointSet to a point set file format.

    :param point_set: Input point set
    :type  point_set: PointSet

    :param serialized_point_set: Output point set serialized in the file format.
    :type  serialized_point_set: str

    :param information_only: Only write point set metadata -- do not write pixel data.
    :type  information_only: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool

    :param serialized_point_set: Input point set serialized in the file format
    :type  serialized_point_set: os.PathLike
    """
    extension = ''.join(Path(serialized_point_set).suffixes)

    io = None
    if extension in extension_to_point_set_io:
        func = f"{extension_to_point_set_io[extension]}_write_point_set"
        mod_name = f"itkwasm_mesh_io_wasi.{func}"
        mod = importlib.import_module(mod_name)
        io = getattr(mod, func)
    else:
        for ioname in point_set_io_index:
            func = f"{ioname}_write_point_set"
            mod_name = f"itkwasm_mesh_io_wasi.{func}"
            mod = importlib.import_module(mod_name)
            io = getattr(mod, func)
            could_write = io(point_set, serialized_point_set, information_only=information_only, use_compression=use_compression)
            if could_write:
                return

    if io is None:
        raise RuntimeError(f"Could not find an point_set writer for {extension}")

    could_write = io(point_set, serialized_point_set, information_only=information_only, use_compression=use_compression)
    if not could_write:
        raise RuntimeError(f"Could not write {serialized_point_set}")

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