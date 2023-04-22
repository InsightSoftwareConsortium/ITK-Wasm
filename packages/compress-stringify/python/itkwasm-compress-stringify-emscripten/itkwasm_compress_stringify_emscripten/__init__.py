"""itkwasm-compress-stringify-emscripten: Zstandard compression and decompression and base64 encoding and decoding in WebAssembly. Emscripten implementation."""

from .compress_stringify_async import compress_stringify_async
from .parse_string_decompress_async import parse_string_decompress_async

from ._version import __version__
