# Generated file. Do not edit.

from pathlib import Path, PurePosixPath
import os
from typing import Dict, Tuple, Optional

from importlib_resources import files as file_resources

from itkwasm import (
    InterfaceTypes,
    PipelineOutput,
    PipelineInput,
    Pipeline,
    BinaryFile,
    Image,
)

def apply_presentation_state_to_image(
    image_in: os.PathLike,
    presentation_state_file: os.PathLike,
    config_file: str = "",
    frame: int = 1,
    no_presentation_state_output: bool = False,
    no_bitmap_output: bool = False,
) -> Tuple[Dict, Image]:
    """Apply a presentation state to a given DICOM image and render output as pgm bitmap or dicom file.

    :param image_in: Input DICOM file
    :type  image_in: os.PathLike

    :param presentation_state_file: Process using presentation state file
    :type  presentation_state_file: os.PathLike

    :param config_file: filename: string. Process using settings from configuration file
    :type  config_file: str

    :param frame: frame: integer. Process using image frame f (default: 1)
    :type  frame: int

    :param no_presentation_state_output: Do not get presentation state information in text stream.
    :type  no_presentation_state_output: bool

    :param no_bitmap_output: Do not get resulting image as bitmap output stream.
    :type  no_bitmap_output: bool

    :return: Output overlay information
    :rtype:  Dict

    :return: Output image
    :rtype:  Image
    """
    pipeline = Pipeline(file_resources('itkwasm_dicom_wasi').joinpath(Path('wasm_modules') / Path('apply-presentation-state-to-image.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.JsonObject),
        PipelineOutput(InterfaceTypes.Image),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(image_in))),
        PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(presentation_state_file))),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    args.append(str(PurePosixPath(image_in)))
    args.append(str(PurePosixPath(presentation_state_file)))
    # Outputs
    args.append('0')
    args.append('1')
    # Options
    if config_file:
        args.append('--config-file')
        args.append(str(config_file))

    if frame:
        args.append('--frame')
        args.append(str(frame))

    if no_presentation_state_output:
        args.append('--no-presentation-state-output')

    if no_bitmap_output:
        args.append('--no-bitmap-output')


    outputs = pipeline.run(args, pipeline_outputs, pipeline_inputs)

    del pipeline

    result = (
        outputs[0].data.data,
        outputs[1].data,
    )
    return result

