# Generated file. Do not edit.

from pathlib import Path
import os
from typing import Dict, Tuple

from .pyodide import js_package

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)

async def parse_string_decompress_async(
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
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    outputs = await js_module.parseStringDecompress(web_worker, to_js(input),  parseString=to_js(parse_string), )

    output_web_worker = None
    output_list = []
    print(dir(outputs))
    outputs_object_map = outputs.as_object_map()
    for output_name in outputs.object_keys():
        if output_name == 'webWorker':
            output_web_worker = outputs_object_map[output_name]
        else:
            print(output_name)
            print(type(outputs_object_map[output_name]))
            print(outputs_object_map[output_name].constructor.name)
            print(outputs_object_map[output_name])
            output_list.append(to_py(outputs_object_map[output_name]))

    js_resources.web_worker = output_web_worker

    if len(output_list) == 1:
        return output_list[0]
    return tuple(output_list)
