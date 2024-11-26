import os
import importlib
from pathlib import Path

from itkwasm import TransformList

from .extension_to_transform_io import extension_to_transform_io
from .transform_io_index import transform_io_index

def read_transform(
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
) -> TransformList:
    """Read a transform file format and convert it to the ITK-Wasm file format.

    :param serialized_transform: Input transform serialized in the file format
    :type  serialized_transform: os.PathLike

    :param float_parameters: Use float for the parameter value type. The default is double.
    :type  float_parameters: bool

    :return: Output transform
    :rtype:  TransformList
    """
    extension = ''.join(Path(serialized_transform).suffixes)

    io = None
    if extension in extension_to_transform_io:
        func = f"{extension_to_transform_io[extension]}_read_transform"
        mod_name = f"itkwasm_transform_io_wasi.{func}"
        mod = importlib.import_module(mod_name)
        io = getattr(mod, func)
    else:
        for ioname in transform_io_index:
            func = f"{ioname}_read_transform"
            mod_name = f"itkwasm_transform_io_wasi.{func}"
            mod = importlib.import_module(mod_name)
            io = getattr(mod, func)
            could_read, transform = io(serialized_transform, float_parameters=float_parameters)
            if could_read:
                return transform

    if io is None:
        raise RuntimeError(f"Could not find an transform reader for {extension}")

    could_read, transform = io(serialized_transform, float_parameters=float_parameters)
    if not could_read:
        raise RuntimeError(f"Could not read {serialized_transform}")

    return transform


def transformread(
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
) -> TransformList:
    return read_transform(serialized_transform, float_parameters=float_parameters)

transformread.__doc__ = f"""{read_transform.__doc__}
    Alias for read_transform.
    """