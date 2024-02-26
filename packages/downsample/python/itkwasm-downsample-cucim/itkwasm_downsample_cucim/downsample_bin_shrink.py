from typing import List
import copy

from itkwasm import Image, array_like_to_cupy_array
import numpy as np
import cupy as cp
from cucim.skimage.transform import downscale_local_mean

from itkwasm_downsample_wasi import downsample_bin_shrink as downsample_bin_shrink_wasi

def downsample_bin_shrink(
    input: Image,
    shrink_factors: List[int] = [],
    information_only: bool = False,
) -> Image:
    """Apply local averaging and subsample the input image.

    :param input: Input image
    :type  input: Image

    :param shrink_factors: Shrink factors
    :type  shrink_factors: int

    :param information_only: Generate output image information only. Do not process pixels.
    :type  information_only: bool

    :return: Output downsampled image
    :rtype:  Image
    """

    wasi_input = copy.copy(input)
    wasi_input.data = np.empty_like(input.data)
    result = downsample_bin_shrink_wasi(wasi_input, shrink_factors, information_only=True)
    if information_only:
        return result

    cu_input_array = array_like_to_cupy_array(input.data)

    shrink_factors = tuple(reversed(shrink_factors))
    expected_shape = tuple(
        max(s // f, 1) for s, f in zip(input.data.shape, shrink_factors)
    )
    cu_output_array = downscale_local_mean(
        cu_input_array,
        shrink_factors,
    )
    # Note: downscale_local_mean pads the shape up to a multiple of the
    #       shrink factor, so we need to truncate to the expected shape.
    out_slices = tuple(slice(s) for s in expected_shape)
    result.data = cu_output_array[out_slices].astype(input.data.dtype)
    result.size = list(reversed(result.data.shape))
    return result