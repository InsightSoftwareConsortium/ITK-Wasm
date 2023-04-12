"""itkwasm-compress-stringify: Zstandard compression and decompression and base64 encoding and decoding in WebAssembly."""

from .compress_stringify import compress_stringify
from .parse_string_decompress import parse_string_decompress

from ._version import __version__
