from pathlib import Path, PurePosixPath
import os
from typing import Dict, Tuple, Optional, List

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

def read_image_dicom_file_series(
    input_images: List[os.PathLike] = [],
    single_sorted_series: bool = False,
) -> Tuple[Image, List[str]]:
    """Read a DICOM image series and return the associated image volume

    :param input_images: File names in the series
    :type  input_images: os.PathLike

    :param single_sorted_series: The input files are a single sorted series
    :type  single_sorted_series: bool

    :return: Output image volume
    :rtype:  Image

    :return: Output sorted filenames
    :rtype:  List[str]
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_dicom_wasi').joinpath(Path('wasm_modules') / Path('read-image-dicom-file-series.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.Image),
        PipelineOutput(InterfaceTypes.JsonCompatible),
    ]

    pipeline_inputs: List[PipelineInput] = [
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    # Outputs
    args.append('0')
    args.append('1')
    # Options
    if len(input_images) < 1:
       raise ValueError('"input-images" kwarg must have a length > 1')
    if len(input_images) > 0:
        args.append('--input-images')
        for value in input_images:
            input_file = str(PurePosixPath(input_images))
            pipeline_inputs.append(PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(value)))
            args.append(input_file)

    if single_sorted_series:
        args.append('--single-sorted-series')


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = (
        outputs[0].data,
        outputs[1].data,
    )
    return result

