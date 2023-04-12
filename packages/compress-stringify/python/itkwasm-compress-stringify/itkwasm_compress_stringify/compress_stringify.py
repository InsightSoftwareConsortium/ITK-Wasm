# Generated file. Do not edit.

from itkwasm import (
    environment_dispatch,
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
    func = environment_dispatch("itkwasm_compress_stringify", "compress_stringify")
    output = func(input, stringify=stringify, compression_level=compression_level, data_url_prefix=data_url_prefix)
    return output
