# Generated file. Do not edit.

from itkwasm import (
    environment_dispatch,
    BinaryStream,
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
    func = environment_dispatch("itkwasm_compress_stringify", "parse_string_decompress_async")
    output = await func(input, parse_string=parse_string)
    return output
