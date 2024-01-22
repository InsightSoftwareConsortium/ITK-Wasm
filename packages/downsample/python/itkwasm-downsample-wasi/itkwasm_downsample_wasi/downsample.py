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

def downsample(
    input: Image,
    shrink_factors: List[int] = [],
    crop_radius: Optional[List[int]] = None,
) -> Image:
    """Apply a smoothing anti-alias filter and subsample the input image.

    :param input: Input image
    :type  input: Image

    :param shrink_factors: Shrink factors
    :type  shrink_factors: int

    :param crop_radius: Optional crop radius in pixel units.
    :type  crop_radius: int

    :return: Output downsampled image
    :rtype:  Image
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_downsample_wasi').joinpath(Path('wasm_modules') / Path('downsample.wasi.wasm')))

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

    if crop_radius is not None and len(crop_radius) < 2:
       raise ValueError('"crop-radius" kwarg must have a length > 2')
    if crop_radius is not None and len(crop_radius) > 0:
        args.append('--crop-radius')
        for value in crop_radius:
            args.append(str(value))


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = outputs[0].data
    return result

