import os
from typing import Optional, Union

from itkwasm import (
    environment_dispatch,
    TransformList,
)

def read_transform(
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
) -> TransformList:
    """Read a transform file format and convert it to the ITK-Wasm file format

    :param serialized_transform: Input transform serialized in the file format
    :type  serialized_transform: os.PathLike

    :param float_parameters: Use float for the parameter value type. The default is double.
    :type  float_parameters: bool

    :return: Output transform
    :rtype:  TransformList
    """
    func = environment_dispatch("itkwasm_transform_io", "read_transform")
    output = func(serialized_transform, float_parameters=float_parameters)
    return output

def transformread(
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
) -> TransformList:
    return read_transform(serialized_transform, float_parameters=float_parameters)

transformread.__doc__ = f"""{read_transform.__doc__}
    Alias for read_transform.
    """