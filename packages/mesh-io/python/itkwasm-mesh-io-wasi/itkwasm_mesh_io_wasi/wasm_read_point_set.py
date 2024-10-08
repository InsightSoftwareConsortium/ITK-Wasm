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
    PointSet,
)

def wasm_read_point_set(
    serialized_point_set: os.PathLike,
    information_only: bool = False,
) -> Tuple[Any, PointSet]:
    """Read a point set file format and convert it to the itk-wasm file format

    :param serialized_point_set: Input point set serialized in the file format
    :type  serialized_point_set: os.PathLike

    :param information_only: Only read point set metadata -- do not read pixel data.
    :type  information_only: bool

    :return: Whether the input could be read. If false, the output point set is not valid.
    :rtype:  Any

    :return: Output point set
    :rtype:  PointSet
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_mesh_io_wasi').joinpath(Path('wasm_modules') / Path('wasm-read-point-set.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.JsonCompatible),
        PipelineOutput(InterfaceTypes.PointSet),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(serialized_point_set))),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    if not Path(serialized_point_set).exists():
        raise FileNotFoundError("serialized_point_set does not exist")
    args.append(str(PurePosixPath(serialized_point_set)))
    # Outputs
    could_read_name = '0'
    args.append(could_read_name)

    point_set_name = '1'
    args.append(point_set_name)

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

