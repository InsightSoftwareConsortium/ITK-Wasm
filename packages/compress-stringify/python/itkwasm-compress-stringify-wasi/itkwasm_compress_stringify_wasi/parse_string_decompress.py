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

def parse_string_decompress(
    input: bytes,
    parse_string: bool = False,
) -> bytes:
    """Given a binary or string produced with compress-stringify, decompress and optionally base64 decode.

    Parameters
    ----------

    input: bytes
        Compressed input

    parse_string: bool, optional
        Parse the input string before decompression


    Returns
    -------

    bytes
        Output decompressed binary

    """
    pipeline = Pipeline(file_resources('itkwasm_compress_stringify_wasi').joinpath(Path('wasm_modules') / Path('parse-string-decompress.wasi.wasm')))

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
    if parse_string is not None:
        args.append('--parse-string')


    outputs = pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = outputs[0].data.data
    return result


    del pipeline
