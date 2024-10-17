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
    PointSet,
    BinaryFile,
)

def vtk_poly_data_write_point_set(
    point_set: PointSet,
    serialized_point_set: str,
    information_only: bool = False,
    use_compression: bool = False,
    binary_file_type: bool = False,
) -> Tuple[Any]:
    """Write an ITK-Wasm file format converted to a point set file format

    :param point_set: Input point set
    :type  point_set: PointSet

    :param serialized_point_set: Output point set
    :type  serialized_point_set: str

    :param information_only: Only write point set metadata -- do not write pixel data.
    :type  information_only: bool

    :param use_compression: Use compression in the written file, if supported
    :type  use_compression: bool

    :param binary_file_type: Use a binary file type in the written file, if supported
    :type  binary_file_type: bool

    :return: Whether the input could be written. If false, the output mesh is not valid.
    :rtype:  Any
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_mesh_io_wasi').joinpath(Path('wasm_modules') / Path('vtk-poly-data-write-point-set.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.JsonCompatible),
        PipelineOutput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(serialized_point_set))),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.PointSet, point_set),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    args.append('0')
    # Outputs
    could_write_name = '0'
    args.append(could_write_name)

    serialized_point_set_name = str(PurePosixPath(serialized_point_set))
    args.append(serialized_point_set_name)

    # Options
    input_count = len(pipeline_inputs)
    if information_only:
        args.append('--information-only')

    if use_compression:
        args.append('--use-compression')

    if binary_file_type:
        args.append('--binary-file-type')


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = outputs[0].data
    return result

