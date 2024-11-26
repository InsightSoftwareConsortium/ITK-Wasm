import os
import importlib
from pathlib import Path

from itkwasm import TransformList

from .extension_to_transform_io import extension_to_transform_io
from .transform_io_index import transform_io_index

def write_transform(
    transform: TransformList,
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
    use_compression: bool = False,
) -> None:
    """Write an itk-wasm TransformList to an transform file format.

    :param transform: Input transform
    :type  transform: TransformList

    :param serialized_transform: Output transform serialized in the file format.
    :type  serialized_transform: str

    :param float_parameters: Use float for the parameter value type. The default is double.
    :type  float_parameters: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool

    :param serialized_transform: Input transform serialized in the file format
    :type  serialized_transform: os.PathLike
    """
    extension = ''.join(Path(serialized_transform).suffixes)

    io = None
    if extension in extension_to_transform_io:
        func = f"{extension_to_transform_io[extension]}_write_transform"
        mod_name = f"itkwasm_transform_io_wasi.{func}"
        mod = importlib.import_module(mod_name)
        io = getattr(mod, func)
    else:
        for ioname in transform_io_index:
            func = f"{ioname}_write_transform"
            mod_name = f"itkwasm_transform_io_wasi.{func}"
            mod = importlib.import_module(mod_name)
            io = getattr(mod, func)
            could_write = io(transform, serialized_transform, float_parameters=float_parameters, use_compression=use_compression)
            if could_write:
                return

    if io is None:
        raise RuntimeError(f"Could not find an transform writer for {extension}")

    could_write = io(transform, serialized_transform, float_parameters=float_parameters, use_compression=use_compression)
    if not could_write:
        raise RuntimeError(f"Could not write {serialized_transform}")

def transformwrite(
    transform: TransformList,
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
    use_compression: bool = False,
) -> None:
    return write_transform(transform, serialized_transform, float_parameters=float_parameters, use_compression=use_compression)

transformwrite.__doc__ = f"""{write_transform.__doc__}
    Alias for write_transform.
    """