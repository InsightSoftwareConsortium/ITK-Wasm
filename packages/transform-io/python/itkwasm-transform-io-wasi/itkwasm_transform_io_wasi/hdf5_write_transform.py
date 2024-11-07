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
    BinaryFile,
)

def hdf5_write_transform(
    transform: TransformList,
    serialized_transform: str,
    float_parameters: bool = False,
    use_compression: bool = False,
) -> Tuple[Any]:
    """Write an ITK-Wasm transform file format converted to a transform file format

    :param transform: Input transform
    :type  transform: TransformList

    :param serialized_transform: Output transform serialized in the file format.
    :type  serialized_transform: str

    :param float_parameters: Use float for the parameter value type. The default is double.
    :type  float_parameters: bool

    :param use_compression: Use compression in the written file
    :type  use_compression: bool

    :return: Whether the input could be written. If false, the output transform is not valid.
    :rtype:  Any
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_transform_io_wasi').joinpath(Path('wasm_modules') / Path('hdf5-write-transform.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.JsonCompatible),
        PipelineOutput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(serialized_transform))),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.TransformList, transform),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    args.append('0')
    # Outputs
    could_write_name = '0'
    args.append(could_write_name)

    serialized_transform_name = str(PurePosixPath(serialized_transform))
    args.append(serialized_transform_name)

    # Options
    input_count = len(pipeline_inputs)
    if float_parameters:
        args.append('--float-parameters')

    if use_compression:
        args.append('--use-compression')


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = outputs[0].data
    return result

