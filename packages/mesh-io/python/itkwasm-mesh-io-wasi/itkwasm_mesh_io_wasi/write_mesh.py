import os
import importlib
from pathlib import Path

from itkwasm import Mesh, PixelTypes, IntTypes, FloatTypes

from .extension_to_mesh_io import extension_to_mesh_io
from .mesh_io_index import mesh_io_index

def write_mesh(
    mesh: Mesh,
    serialized_mesh: os.PathLike,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    """Write an itk-wasm Mesh to an mesh file format.

    :param mesh: Input mesh
    :type  mesh: Mesh

    :param serialized_mesh: Output mesh serialized in the file format.
    :type  serialized_mesh: str

    :param information_only: Only write mesh metadata -- do not write pixel data.
    :type  information_only: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool

    :param serialized_mesh: Input mesh serialized in the file format
    :type  serialized_mesh: os.PathLike
    """
    extension = ''.join(Path(serialized_mesh).suffixes)

    io = None
    if extension in extension_to_mesh_io:
        func = f"{extension_to_mesh_io[extension]}_write_mesh"
        mod_name = f"itkwasm_mesh_io_wasi.{func}"
        mod = importlib.import_module(mod_name)
        io = getattr(mod, func)
    else:
        for ioname in mesh_io_index:
            func = f"{ioname}_write_mesh"
            mod_name = f"itkwasm_mesh_io_wasi.{func}"
            mod = importlib.import_module(mod_name)
            io = getattr(mod, func)
            could_write = io(mesh, serialized_mesh, information_only=information_only, use_compression=use_compression)
            if could_write:
                return

    if io is None:
        raise RuntimeError(f"Could not find an mesh writer for {extension}")

    could_write = io(mesh, serialized_mesh, information_only=information_only, use_compression=use_compression)
    if not could_write:
        raise RuntimeError(f"Could not write {serialized_mesh}")

def meshwrite(
    mesh: Mesh,
    serialized_mesh: os.PathLike,
    information_only: bool = False,
    use_compression: bool = False,
) -> None:
    return write_mesh(mesh, serialized_mesh, information_only=information_only, use_compression=use_compression)

meshwrite.__doc__ = f"""{write_mesh.__doc__}
    Alias for write_mesh.
    """