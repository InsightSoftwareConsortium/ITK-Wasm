"""itkwasm-downsample-cucim: Pipelines for downsampling images. cuCIM implementation."""

from .downsample_bin_shrink import downsample_bin_shrink
from .downsample import downsample

from ._version import __version__
