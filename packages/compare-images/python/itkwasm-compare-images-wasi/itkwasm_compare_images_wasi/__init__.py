"""itkwasm-compare-images-wasi: Read files and images related to compare-images file format. WASI implementation."""

from .compare_images import compare_images
from .compare_double_images import compare_double_images
from .vector_magnitude import vector_magnitude

from ._version import __version__
