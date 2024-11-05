# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    Transform,
    BinaryFile,
)

def wasm_write_transform(
    transform: Transform,
    serialized_transform: str,
    float_parameters: bool = False,
    use_compression: bool = False,
) -> Tuple[Any]:
    """Write an ITK-Wasm transform file format converted to a transform file format

    :param transform: Input transform
    :type  transform: Transform

    :param serialized_transform: Output transform serialized in the file format.
    :type  serialized_transform: str

    :param float_parameters: Use float for the parameter value type. The default is double.
    :type  float_parameters: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool

    :return: Whether the input could be written. If false, the output transform is not valid.
    :rtype:  Any
    """
    func = environment_dispatch("itkwasm_transform_io", "wasm_write_transform")
    output = func(transform, serialized_transform, float_parameters=float_parameters, use_compression=use_compression)
    return output
