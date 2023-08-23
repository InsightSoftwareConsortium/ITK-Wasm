# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
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
    func = environment_dispatch("itkwasm_compress_stringify", "parse_string_decompress_async")
    output = await func(input, parse_string=parse_string)
    return output
