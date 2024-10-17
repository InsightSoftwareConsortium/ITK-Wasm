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
    Mesh,
    BinaryFile,
)

def free_surfer_binary_write_mesh(
    mesh: Mesh,
    serialized_mesh: str,
    information_only: bool = False,
    use_compression: bool = False,
    binary_file_type: bool = False,
) -> Tuple[Any]:
    """Write an itk-wasm file format converted to an mesh file format

    :param mesh: Input mesh
    :type  mesh: Mesh

    :param serialized_mesh: Output mesh
    :type  serialized_mesh: str

    :param information_only: Only write mesh metadata -- do not write pixel data.
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
        _pipeline = Pipeline(file_resources('itkwasm_mesh_io_wasi').joinpath(Path('wasm_modules') / Path('free-surfer-binary-write-mesh.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.JsonCompatible),
        PipelineOutput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(serialized_mesh))),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.Mesh, mesh),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    args.append('0')
    # Outputs
    could_write_name = '0'
    args.append(could_write_name)

    serialized_mesh_name = str(PurePosixPath(serialized_mesh))
    args.append(serialized_mesh_name)

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

