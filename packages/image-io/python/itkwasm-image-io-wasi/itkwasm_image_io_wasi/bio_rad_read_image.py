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
    BinaryFile,
    Image,
)

def bio_rad_read_image(
    serialized_image: os.PathLike,
    information_only: bool = False,
) -> Tuple[Any, Image]:
    """Read an image file format and convert it to the itk-wasm file format

    :param serialized_image: Input image serialized in the file format
    :type  serialized_image: os.PathLike

    :param information_only: Only read image metadata -- do not read pixel data.
    :type  information_only: bool

    :return: Whether the input could be read. If false, the output image is not valid.
    :rtype:  Any

    :return: Output image
    :rtype:  Image
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_image_io_wasi').joinpath(Path('wasm_modules') / Path('bio-rad-read-image.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.JsonCompatible),
        PipelineOutput(InterfaceTypes.Image),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(serialized_image))),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    if not Path(serialized_image).exists():
        raise FileNotFoundError("serialized_image does not exist")
    args.append(str(PurePosixPath(serialized_image)))
    # Outputs
    could_read_name = '0'
    args.append(could_read_name)

    image_name = '1'
    args.append(image_name)

    # Options
    input_count = len(pipeline_inputs)
    if information_only:
        args.append('--information-only')


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = (
        outputs[0].data,
        outputs[1].data,
    )
    return result

