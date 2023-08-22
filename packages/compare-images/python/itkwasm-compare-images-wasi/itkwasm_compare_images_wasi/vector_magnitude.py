# Generated file. To retain edits, remove this comment.

# Generated file. Do not edit.

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

def vector_magnitude(
    vector_image: Image,
) -> Image:
    """Generate a scalar magnitude image based on the input vector's norm.

    :param vector_image: Input vector image
    :type  vector_image: Image

    :return: Output magnitude image
    :rtype:  Image
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_compare_images_wasi').joinpath(Path('wasm_modules') / Path('vector-magnitude.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.Image),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.Image, vector_image),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    args.append('0')
    # Outputs
    args.append('0')
    # Options

    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = outputs[0].data
    return result

