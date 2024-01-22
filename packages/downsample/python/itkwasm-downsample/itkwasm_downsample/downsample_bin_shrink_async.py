# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    Image,
)

async def downsample_bin_shrink_async(
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
    func = environment_dispatch("itkwasm_downsample", "downsample_bin_shrink_async")
    output = await func(input, shrink_factors=shrink_factors, information_only=information_only)
    return output
