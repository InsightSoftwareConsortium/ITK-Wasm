# Generated file. To retain edits, remove this comment.

from pathlib import Path
import os
from typing import Dict, Tuple, Optional, List, Any

from .js_package import js_package

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)
from itkwasm import (
    InterfaceTypes,
    BinaryStream,
)

async def parse_string_decompress_async(
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
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if parse_string:
        kwargs["parseString"] = to_js(parse_string)

    outputs = await js_module.parseStringDecompress(to_js(input), webWorker=web_worker, noCopy=True, **kwargs)

    output_web_worker = None
    output_list = []
    outputs_object_map = outputs.as_object_map()
    for output_name in outputs.object_keys():
        if output_name == 'webWorker':
            output_web_worker = outputs_object_map[output_name]
        else:
            output_list.append(to_py(outputs_object_map[output_name]))

    js_resources.web_worker = output_web_worker

    if len(output_list) == 1:
        return output_list[0]
    return tuple(output_list)
