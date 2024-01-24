# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
)

async def downsample_sigma_async(
    shrink_factors: List[int] = [],
) -> Any:
    """Compute gaussian kernel sigma values in pixel units for downsampling.

    :param shrink_factors: Shrink factors
    :type  shrink_factors: int

    :return: Output sigmas in pixel units.
    :rtype:  Any
    """
    func = environment_dispatch("itkwasm_downsample", "downsample_sigma_async")
    output = await func(shrink_factors=shrink_factors)
    return output
