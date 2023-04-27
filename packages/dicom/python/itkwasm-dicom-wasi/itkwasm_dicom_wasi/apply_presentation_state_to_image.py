# Generated file. Do not edit.

from pathlib import Path
import os
from typing import Dict, Tuple

from importlib_resources import files as file_resources

from itkwasm import (
    InterfaceTypes,
    PipelineOutput,
    PipelineInput,
    Pipeline,
    JsonObject,
    Image,
)

def apply_presentation_state_to_image(
    image_in: os.PathLike,
    presentation_state_file: os.PathLike,
    config_file: str = "undefined",
    frame: int = 1,
    presentation_state_output: bool = False,
    bitmap_output: bool = False,
    pgm: bool = False,
    dicom: bool = False,
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

    :param presentation_state_output: get presentation state information in text stream (default: ON).
    :type  presentation_state_output: bool

    :param bitmap_output: get resulting image as bitmap output stream (default: ON).
    :type  bitmap_output: bool

    :param pgm: save image as PGM (default)
    :type  pgm: bool

    :param dicom: save image as DICOM secondary capture
    :type  dicom: bool

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
        PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(image_in)),
        PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(presentation_state_file)),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    args.append(str(image_in))
    args.append(str(presentation_state_file))
    # Outputs
    args.append('0')
    args.append('1')
    # Options
    if config_file is not None:
        args.append('--config-file')
        args.append(str(config_file))

    if frame is not None:
        args.append('--frame')
        args.append(str(frame))

    if presentation_state_output is not None:
        args.append('--presentation-state-output')

    if bitmap_output is not None:
        args.append('--bitmap-output')

    if pgm is not None:
        args.append('--pgm')

    if dicom is not None:
        args.append('--dicom')


    outputs = pipeline.run(args, pipeline_outputs, pipeline_inputs)

    del pipeline

    result = (
        outputs[0].data,
        outputs[1].data,
    )
    return result

