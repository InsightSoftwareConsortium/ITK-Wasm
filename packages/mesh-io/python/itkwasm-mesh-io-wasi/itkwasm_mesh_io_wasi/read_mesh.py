import os
import importlib
from pathlib import Path

from itkwasm import Mesh

from .extension_to_mesh_io import extension_to_mesh_io
from .mesh_io_index import mesh_io_index

def read_mesh(
    serialized_mesh: os.PathLike,
    information_only: bool = False,
) -> Mesh:
    """Read a mesh file format and convert it to the ITK-Wasm file format.

    :param serialized_mesh: Input mesh serialized in the file format
    :type  serialized_mesh: os.PathLike

    :param information_only: Only read mesh metadata -- do not read pixel data.
    :type  information_only: bool

    :return: Output mesh
    :rtype:  Mesh
    """
    extension = ''.join(Path(serialized_mesh).suffixes)

    io = None
    if extension in extension_to_mesh_io:
        func = f"{extension_to_mesh_io[extension]}_read_mesh"
        mod_name = f"itkwasm_mesh_io_wasi.{func}"
        mod = importlib.import_module(mod_name)
        io = getattr(mod, func)
    else:
        for ioname in mesh_io_index:
            func = f"{ioname}_read_mesh"
            mod_name = f"itkwasm_mesh_io_wasi.{func}"
            mod = importlib.import_module(mod_name)
            io = getattr(mod, func)
            could_read, mesh = io(serialized_mesh, information_only=information_only)
            if could_read:
                return mesh

    if io is None:
        raise RuntimeError(f"Could not find an mesh reader for {extension}")

    could_read, mesh = io(serialized_mesh, information_only=information_only)
    if not could_read:
        raise RuntimeError(f"Could not read {serialized_mesh}")

    return mesh


def meshread(
    serialized_mesh: os.PathLike,
    information_only: bool = False,
) -> Mesh:
    return read_mesh(serialized_mesh, information_only=information_only)

meshread.__doc__ = f"""{read_mesh.__doc__}
    Alias for read_mesh.
    """