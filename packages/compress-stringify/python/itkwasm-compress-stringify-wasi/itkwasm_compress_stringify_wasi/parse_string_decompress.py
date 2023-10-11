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
    BinaryStream,
)

def parse_string_decompress(
    input: bytes,
    parse_string: bool = False,
) -> bytes:
    """Given a binary or string produced with compress-stringify, decompress and optionally base64 decode.

    :param input: Compressed input
    :type  input: bytes

    :param parse_string: Parse the input string before decompression
    :type  parse_string: bool

    :return: Output decompressed binary
    :rtype:  bytes
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_compress_stringify_wasi').joinpath(Path('wasm_modules') / Path('parse-string-decompress.wasi.wasm')))

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
    output_name = '0'
    args.append(output_name)

    # Options
    input_count = len(pipeline_inputs)
    if parse_string:
        args.append('--parse-string')


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = outputs[0].data.data
    return result

