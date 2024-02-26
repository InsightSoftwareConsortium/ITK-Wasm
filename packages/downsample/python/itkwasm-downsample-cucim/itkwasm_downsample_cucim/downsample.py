from typing import Optional, List
import copy

from itkwasm import Image, array_like_to_cupy_array
import numpy as np
import cupy as cp
from cupyx.scipy.ndimage import affine_transform

from ._discrete_gaussian import discrete_gaussian_filter

from itkwasm_downsample_wasi import downsample_sigma
from itkwasm_downsample_wasi import downsample_bin_shrink as downsample_bin_shrink_wasi

from itkwasm import Image

def downsample(
    input: Image,
    shrink_factors: List[int] = [],
    crop_radius: Optional[List[int]] = None,
) -> Image:
    """Apply a smoothing anti-alias filter and subsample the input image.

    :param input: Input image
    :type  input: Image

    :param shrink_factors: Shrink factors
    :type  shrink_factors: int

    :param crop_radius: Optional crop radius in pixel units.
    :type  crop_radius: int

    :return: Output downsampled image
    :rtype:  Image
    """

    sigma = downsample_sigma(shrink_factors)
    wasi_input = copy.copy(input)
    wasi_input.data = np.empty_like(input.data)
    result = downsample_bin_shrink_wasi(wasi_input, shrink_factors, information_only=True)

    cu_input_array = array_like_to_cupy_array(input.data)

    maximum_error = 0.01
    maximum_kernel_width = 32

    spacing = (1.0, ) * input.data.ndim
    cu_output_array = discrete_gaussian_filter(
        cu_input_array,
        sigma=sigma,
        spacing=spacing,
        max_error=maximum_error,
        max_half_width=maximum_kernel_width - 1,
    )

    output_origin = [0.0] * input.imageType.dimension
    output_spacing = [1.0] * input.imageType.dimension
    output_size = [s // f for s, f in zip(input.size, shrink_factors)]
    offset = [0] * cu_output_array.ndim
    matrix = cp.eye(cu_output_array.ndim)
    for i in range(input.imageType.dimension):
        crop_radius_value = crop_radius[i] if crop_radius is not None else 0.0

        offset[i] = crop_radius_value
        matrix[i, i] = shrink_factors[i]

        output_origin[i] = input.origin[i] + crop_radius_value * input.spacing[i]
        output_spacing[i] = input.spacing[i] * shrink_factors[i]
        output_size[i] = int(max(0, (input.size[i] - 2 * crop_radius_value) // shrink_factors[i]))

    result_data = affine_transform(
        cu_output_array,
        matrix,
        offset=offset,
        output_shape=tuple(reversed(output_size)),
        order=1,
        mode='constant',
        cval=0.0,
    )

    result.data = result_data.astype(input.data.dtype)
    result.origin = output_origin
    result.spacing = output_spacing
    result.size = output_size

    return result

