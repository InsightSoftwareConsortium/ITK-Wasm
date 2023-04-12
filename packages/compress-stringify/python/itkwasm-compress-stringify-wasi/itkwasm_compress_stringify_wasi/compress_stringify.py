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
    BinaryStream,
)

def compress_stringify(
    input: bytes,
    stringify: bool = False,
    compression_level: int = 3,
    data_url_prefix: str = "data:base64,",
) -> bytes:
    """Given a binary, compress and optionally base64 encode.

    Parameters
    ----------

    input: bytes
        Input binary

    stringify: bool, optional
        Stringify the output

    compression_level: int, optional
        Compression level, typically 1-9

    data_url_prefix: str, optional
        dataURL prefix


    Returns
    -------

    bytes
        Output compressed binary

    """
    pipeline = Pipeline(file_resources('itkwasm_compress_stringify_wasi').joinpath(Path('wasm_modules') / Path('compress-stringify.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.BinaryStream),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.BinaryStream, BinaryStream(input)),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    args.append('0')
    # Outputs
    args.append('0')
    # Options
    if stringify is not None:
        args.append('--stringify')

    if compression_level is not None:
        args.append('--compression-level')
        args.append(str(compression_level))

    if data_url_prefix is not None:
        args.append('--data-url-prefix')
        args.append(str(data_url_prefix))


    outputs = pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = outputs[0].data.data
    return result


    del pipeline
