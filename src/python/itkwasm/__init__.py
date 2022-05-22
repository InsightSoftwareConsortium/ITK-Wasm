"""itkwasm: Python interface to itk-wasm WebAssembly modules."""

__version__ = "1.0a0"

from .image import Image, ImageType

__all__ = [
  "Image",
  "ImageType",
]