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
    TransformList,
)

def mat_read_transform(
    serialized_transform: os.PathLike,
    float_parameters: bool = False,
) -> Tuple[Any, TransformList]:
    """Read an transform file format and convert it to the ITK-Wasm transform file format

    :param serialized_transform: Input transform serialized in the file format
    :type  serialized_transform: os.PathLike

    :param float_parameters: Use float for the parameter value type. The default is double.
    :type  float_parameters: bool

    :return: Whether the input could be read. If false, the output transform is not valid.
    :rtype:  Any

    :return: Output transform
    :rtype:  TransformList
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_transform_io_wasi').joinpath(Path('wasm_modules') / Path('mat-read-transform.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.JsonCompatible),
        PipelineOutput(InterfaceTypes.TransformList),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(serialized_transform))),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    if not Path(serialized_transform).exists():
        raise FileNotFoundError("serialized_transform does not exist")
    args.append(str(PurePosixPath(serialized_transform)))
    # Outputs
    could_read_name = '0'
    args.append(could_read_name)

    transform_name = '1'
    args.append(transform_name)

    # Options
    input_count = len(pipeline_inputs)
    if float_parameters:
        args.append('--float-parameters')


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = (
        outputs[0].data,
        outputs[1].data,
    )
    return result

