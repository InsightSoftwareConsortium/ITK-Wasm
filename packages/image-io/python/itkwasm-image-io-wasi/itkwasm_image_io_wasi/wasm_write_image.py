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
    BinaryFile,
)

def wasm_write_image(
    image: Image,
    serialized_image: str,
    information_only: bool = False,
    use_compression: bool = False,
) -> Tuple[Any]:
    """Write an itk-wasm file format converted to an image file format

    :param image: Input image
    :type  image: Image

    :param serialized_image: Output image serialized in the file format.
    :type  serialized_image: str

    :param information_only: Only write image metadata -- do not write pixel data.
    :type  information_only: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool

    :return: Whether the input could be written. If false, the output image is not valid.
    :rtype:  Any
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_image_io_wasi').joinpath(Path('wasm_modules') / Path('wasm-write-image.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.JsonCompatible),
        PipelineOutput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(serialized_image))),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.Image, image),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    args.append('0')
    # Outputs
    could_write_name = '0'
    args.append(could_write_name)

    serialized_image_name = str(PurePosixPath(serialized_image))
    args.append(serialized_image_name)

    # Options
    input_count = len(pipeline_inputs)
    if information_only:
        args.append('--information-only')

    if use_compression:
        args.append('--use-compression')


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = outputs[0].data
    return result

