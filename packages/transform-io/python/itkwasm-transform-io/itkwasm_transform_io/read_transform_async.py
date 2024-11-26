import os
from typing import Optional, Union

from itkwasm import (
    environment_dispatch,
    TransformList,
)

async def read_transform_async(
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
) -> TransformList:
    """Read an transform file format and convert it to the ITK-Wasm file format.

    :param serialized_transform: Input transform serialized in the file format
    :type  serialized_transform: os.PathLike

    :param float_parameters: Use float for the parameter value type. The default is double.
    :type  float_parameters: bool

    :return: Output transform
    :rtype:  TransformList
    """
    func = environment_dispatch("itkwasm_transform_io", "read_transform_async")
    output = await func(serialized_transform, float_parameters=float_parameters)
    return output

async def transformread_async(
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
) -> TransformList:
    return await read_transform_async(serialized_transform, float_parameters=float_parameters)

transformread_async.__doc__ = f"""{read_transform_async.__doc__}
    Alias for read_transform.
    """