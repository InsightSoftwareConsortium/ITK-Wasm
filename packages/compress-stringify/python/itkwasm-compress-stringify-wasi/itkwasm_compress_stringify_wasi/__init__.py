"""itkwasm-compress-stringify-wasi: Zstandard compression and decompression and base64 encoding and decoding in WebAssembly. WASI implementation."""

from .compress_stringify import compress_stringify
from .parse_string_decompress import parse_string_decompress

from ._version import __version__
