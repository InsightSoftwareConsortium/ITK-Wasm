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
    Mesh,
)

def swc_read_mesh(
    serialized_mesh: os.PathLike,
    information_only: bool = False,
) -> Tuple[Any, Mesh]:
    """Read a mesh file format and convert it to the itk-wasm file format

    :param serialized_mesh: Input mesh serialized in the file format
    :type  serialized_mesh: os.PathLike

    :param information_only: Only read mesh metadata -- do not read pixel data.
    :type  information_only: bool

    :return: Whether the input could be read. If false, the output mesh is not valid.
    :rtype:  Any

    :return: Output mesh
    :rtype:  Mesh
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_mesh_io_wasi').joinpath(Path('wasm_modules') / Path('swc-read-mesh.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.JsonCompatible),
        PipelineOutput(InterfaceTypes.Mesh),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(serialized_mesh))),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    if not Path(serialized_mesh).exists():
        raise FileNotFoundError("serialized_mesh does not exist")
    args.append(str(PurePosixPath(serialized_mesh)))
    # Outputs
    could_read_name = '0'
    args.append(could_read_name)

    mesh_name = '1'
    args.append(mesh_name)

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

