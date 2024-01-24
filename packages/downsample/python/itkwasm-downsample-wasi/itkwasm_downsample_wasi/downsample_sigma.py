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

def downsample_sigma(
    shrink_factors: List[int] = [],
) -> List[float]:
    """Compute gaussian kernel sigma values in pixel units for downsampling.

    :param shrink_factors: Shrink factors
    :type  shrink_factors: int

    :return: Output sigmas in pixel units.
    :rtype:  List[float]
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_downsample_wasi').joinpath(Path('wasm_modules') / Path('downsample-sigma.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.JsonCompatible),
    ]

    pipeline_inputs: List[PipelineInput] = [
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    # Outputs
    sigma_name = '0'
    args.append(sigma_name)

    # Options
    input_count = len(pipeline_inputs)
    if len(shrink_factors) < 1:
       raise ValueError('"shrink-factors" kwarg must have a length > 1')
    if len(shrink_factors) > 0:
        args.append('--shrink-factors')
        for value in shrink_factors:
            args.append(str(value))


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = outputs[0].data
    return result

