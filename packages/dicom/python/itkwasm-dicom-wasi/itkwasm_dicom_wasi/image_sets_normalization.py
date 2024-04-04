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
)

def image_sets_normalization(
    files: List[os.PathLike] = [],
    series_group_by: Optional[Any] = None,
    image_set_group_by: Optional[Any] = None,
) -> Any:
    """Group DICOM files into image sets

    :param files: DICOM files
    :type  files: os.PathLike

    :param series_group_by: Create series so that all instances in a series share these tags. Option is a JSON object with a "tags" array. Example tag: "0008|103e". If not provided, defaults to Series UID and Frame Of Reference UID tags.
    :type  series_group_by: Any

    :param image_set_group_by: Create image sets so that all series in a set share these tags. Option is a JSON object with a "tags" array. Example tag: "0008|103e". If not provided, defaults to Study UID tag.
    :type  image_set_group_by: Any

    :return: Image sets JSON
    :rtype:  Any
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_dicom_wasi').joinpath(Path('wasm_modules') / Path('image-sets-normalization.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.JsonCompatible),
    ]

    pipeline_inputs: List[PipelineInput] = [
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    # Outputs
    image_sets_name = '0'
    args.append(image_sets_name)

    # Options
    input_count = len(pipeline_inputs)
    if len(files) < 1:
       raise ValueError('"files" kwarg must have a length > 1')
    if len(files) > 0:
        args.append('--files')
        for value in files:
            input_file = str(PurePosixPath(value))
            pipeline_inputs.append(PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(value)))
            args.append(input_file)

    if series_group_by is not None:
        pipeline_inputs.append(PipelineInput(InterfaceTypes.JsonCompatible, series_group_by))
        args.append('--series-group-by')
        args.append(str(input_count))
        input_count += 1

    if image_set_group_by is not None:
        pipeline_inputs.append(PipelineInput(InterfaceTypes.JsonCompatible, image_set_group_by))
        args.append('--image-set-group-by')
        args.append(str(input_count))
        input_count += 1


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = outputs[0].data
    return result

