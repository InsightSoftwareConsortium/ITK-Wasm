# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    Image,
)

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
    func = environment_dispatch("itkwasm_downsample", "downsample")
    output = func(input, shrink_factors=shrink_factors, crop_radius=crop_radius)
    return output
