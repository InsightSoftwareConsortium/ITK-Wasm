import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    TransformList,
)

async def write_transform_async(
    transform: TransformList,
    serialized_transform: str,
    float_parameters: bool = False,
    use_compression: bool = False,
) -> None:
    """Write an ITK-Wasm file format converted to a transform file format.

    :param transform: Input transform
    :type  transform: TransformList

    :param serialized_transform: Output transform serialized in the file format.
    :type  serialized_transform: str

    :param float_parameters: Only write transform metadata -- do not write pixel data.
    :type  float_parameters: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool
    """
    func = environment_dispatch("itkwasm_transform_io", "write_transform_async")
    await func(transform, serialized_transform, float_parameters=float_parameters, use_compression=use_compression)
    return

async def transformwrite_async(
    transform: TransformList,
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
    use_compression: bool = False,
) -> None:
    return await write_transform_async(transform, serialized_transform, float_parameters=float_parameters, use_compression=use_compression)

transformwrite_async.__doc__ = f"""{write_transform_async.__doc__}
    Alias for write_transform.
    """