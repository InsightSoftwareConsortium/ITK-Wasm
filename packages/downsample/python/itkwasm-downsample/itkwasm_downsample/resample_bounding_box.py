# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    TransformList,
    Image,
)

def resample_bounding_box(
    transform: TransformList,
    fixed: Image,
    moving: Image,
    padding: int = 1,
) -> Any:
    """Compute the padded moving-image region needed to resample the fixed image grid through a transform

    :param transform: Spatial transform mapping fixed image points into moving image space
    :type  transform: TransformList

    :param fixed: Fixed image whose grid is resampled (metadata only)
    :type  fixed: Image

    :param moving: Moving image to be sampled (metadata only)
    :type  moving: Image

    :param padding: Pixels of padding added per side (default 1 for linear interpolation)
    :type  padding: int

    :return: The padded moving-image region needed to resample the fixed image grid, as a bounding box (JSON)
    :rtype:  Any
    """
    func = environment_dispatch("itkwasm_downsample", "resample_bounding_box")
    output = func(transform, fixed, moving, padding=padding)
    return output
