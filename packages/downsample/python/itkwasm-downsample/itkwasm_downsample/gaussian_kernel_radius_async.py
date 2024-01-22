# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
)

async def gaussian_kernel_radius_async(
    size: List[int] = [],
    sigma: List[float] = [],
    max_kernel_width: int = 32,
    max_kernel_error: float = 0.01,
) -> Any:
    """Radius in pixels required for effective discrete gaussian filtering.

    :param size: Size in pixels
    :type  size: int

    :param sigma: Sigma in pixel units
    :type  sigma: float

    :param max_kernel_width: Maximum kernel width in pixels.
    :type  max_kernel_width: int

    :param max_kernel_error: Maximum kernel error.
    :type  max_kernel_error: float

    :return: Output kernel radius.
    :rtype:  Any
    """
    func = environment_dispatch("itkwasm_downsample", "gaussian_kernel_radius_async")
    output = await func(size=size, sigma=sigma, max_kernel_width=max_kernel_width, max_kernel_error=max_kernel_error)
    return output
