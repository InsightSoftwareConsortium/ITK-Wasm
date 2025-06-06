# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    BinaryFile,
    TransformList,
)

def wasm_zstd_read_transform(
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
) -> Tuple[Any, TransformList]:
    """Read an transform file format and convert it to the ITK-Wasm transform file format

    :param serialized_transform: Input transform serialized in the file format
    :type  serialized_transform: os.PathLike

    :param float_parameters: Use float for the parameter value type. The default is double.
    :type  float_parameters: bool

    :return: Whether the input could be read. If false, the output transform is not valid.
    :rtype:  Any

    :return: Output transform
    :rtype:  TransformList
    """
    func = environment_dispatch("itkwasm_transform_io", "wasm_zstd_read_transform")
    output = func(serialized_transform, float_parameters=float_parameters)
    return output
