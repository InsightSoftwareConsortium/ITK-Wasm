import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    TransformList,
)

def write_transform(
    transform: TransformList,
    serialized_transform: str,
    float_parameters: bool = False,
    use_compression: bool = False,
) -> None:
    """Write an ITK-Wasm file format converted to a transform file format

    :param transform: Input transform
    :type  transform: TransformList

    :param serialized_transform: Output transform serialized in the file format.
    :type  serialized_transform: str

    :param float_parameters: Use float for the parameter value type. The default is double.
    :type  float_parameters: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool
    """
    func = environment_dispatch("itkwasm_transform_io", "write_transform")
    func(transform, serialized_transform, float_parameters=float_parameters, use_compression=use_compression)
    return

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