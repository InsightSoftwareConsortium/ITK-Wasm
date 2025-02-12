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
    TextFile,
    BinaryFile,
)

def write_rt_struct(
    input_cxt: os.PathLike,
    output_dicom: str,
    dicom_metadata: Optional[Any] = None,
) -> os.PathLike:
    """Write a DICOM RT Struct Structured Set for the given ROI contours and DICOM metadata

    :param input_cxt: Input Plastimatch CXT structure set file
    :type  input_cxt: os.PathLike

    :param output_dicom: Output DICOM RT Struct Structure Set file
    :type  output_dicom: str

    :param dicom_metadata: Additional DICOM metadata
    :type  dicom_metadata: Any
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_dicom_wasi').joinpath(Path('wasm_modules') / Path('write-rt-struct.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(output_dicom))),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.TextFile, TextFile(PurePosixPath(input_cxt))),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    if not Path(input_cxt).exists():
        raise FileNotFoundError("input_cxt does not exist")
    args.append(str(PurePosixPath(input_cxt)))
    # Outputs
    output_dicom_name = str(PurePosixPath(output_dicom))
    args.append(output_dicom_name)

    # Options
    input_count = len(pipeline_inputs)
    if dicom_metadata is not None:
        pipeline_inputs.append(PipelineInput(InterfaceTypes.JsonCompatible, dicom_metadata))
        args.append('--dicom-metadata')
        args.append(str(input_count))
        input_count += 1


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)


