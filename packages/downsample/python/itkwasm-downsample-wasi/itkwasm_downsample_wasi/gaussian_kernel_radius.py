from pathlib import Path, PurePosixPath
import os
from typing import Dict, Tuple, Optional, List, Any

from importlib_resources import files as file_resources

_pipeline = None

from itkwasm import (
    InterfaceTypes,
    PipelineOutput,
    PipelineInput,
    Pipeline,
)

def gaussian_kernel_radius(
    size: List[int] = [],
    sigma: List[float] = [],
    max_kernel_width: int = 32,
    max_kernel_error: float = 0.01,
) -> List[int]:
    """Radius in pixels required for effective discrete gaussian filtering.

    :param size: Size in pixels
    :type  size: int

    :param sigma: Sigma in pixel units
    :type  sigma: float

    :param max_kernel_width: Maximum kernel width in pixels.
    :type  max_kernel_width: int

    :param max_kernel_error: Maximum kernel error.
    :type  max_kernel_error: float

    :return: Output kernel radius.
    :rtype:  List[int]
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_downsample_wasi').joinpath(Path('wasm_modules') / Path('gaussian-kernel-radius.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.JsonCompatible),
    ]

    pipeline_inputs: List[PipelineInput] = [
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    # Outputs
    radius_name = '0'
    args.append(radius_name)

    # Options
    input_count = len(pipeline_inputs)
    if len(size) < 1:
       raise ValueError('"size" kwarg must have a length > 1')
    if len(size) > 0:
        args.append('--size')
        for value in size:
            args.append(str(value))

    if len(sigma) < 1:
       raise ValueError('"sigma" kwarg must have a length > 1')
    if len(sigma) > 0:
        args.append('--sigma')
        for value in sigma:
            args.append(str(value))

    if max_kernel_width:
        args.append('--max-kernel-width')
        args.append(str(max_kernel_width))

    if max_kernel_error:
        args.append('--max-kernel-error')
        args.append(str(max_kernel_error))


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = outputs[0].data
    return result

