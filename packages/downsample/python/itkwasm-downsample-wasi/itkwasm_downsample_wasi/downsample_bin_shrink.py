# Generated file. To retain edits, remove this comment.

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
    Image,
)

def downsample_bin_shrink(
    input: Image,
    shrink_factors: List[int] = [],
    information_only: bool = False,
) -> Image:
    """Apply local averaging and subsample the input image.

    :param input: Input image
    :type  input: Image

    :param shrink_factors: Shrink factors
    :type  shrink_factors: int

    :param information_only: Generate output image information only. Do not process pixels.
    :type  information_only: bool

    :return: Output downsampled image
    :rtype:  Image
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_downsample_wasi').joinpath(Path('wasm_modules') / Path('downsample-bin-shrink.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.Image),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.Image, input),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    args.append('0')
    # Outputs
    downsampled_name = '0'
    args.append(downsampled_name)

    # Options
    input_count = len(pipeline_inputs)
    if len(shrink_factors) < 2:
       raise ValueError('"shrink-factors" kwarg must have a length > 2')
    if len(shrink_factors) > 0:
        args.append('--shrink-factors')
        for value in shrink_factors:
            args.append(str(value))

    if information_only:
        args.append('--information-only')


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = outputs[0].data
    return result

