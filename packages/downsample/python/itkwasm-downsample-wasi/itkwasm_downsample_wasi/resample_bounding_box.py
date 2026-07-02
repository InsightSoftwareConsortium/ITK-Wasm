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
    TransformList,
    Image,
)

def resample_bounding_box(
    transform: TransformList,
    fixed: Image,
    moving: Image,
    padding: int = 1,
) -> Any:
    """Compute the padded moving-image region needed to resample the fixed image grid through a transform

    :param transform: Spatial transform mapping fixed image points into moving image space
    :type  transform: TransformList

    :param fixed: Fixed image whose grid is resampled (metadata only)
    :type  fixed: Image

    :param moving: Moving image to be sampled (metadata only)
    :type  moving: Image

    :param padding: Pixels of padding added per side (default 1 for linear interpolation)
    :type  padding: int

    :return: The padded moving-image region needed to resample the fixed image grid, as a bounding box (JSON)
    :rtype:  Any
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_downsample_wasi').joinpath(Path('wasm_modules') / Path('resample-bounding-box.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.JsonCompatible),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.TransformList, transform),
        PipelineInput(InterfaceTypes.Image, fixed),
        PipelineInput(InterfaceTypes.Image, moving),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    args.append('0')
    args.append('1')
    args.append('2')
    # Outputs
    bounding_box_name = '0'
    args.append(bounding_box_name)

    # Options
    input_count = len(pipeline_inputs)
    if padding is not None:
        args.append('--padding')
        args.append(str(padding))


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = outputs[0].data
    return result

