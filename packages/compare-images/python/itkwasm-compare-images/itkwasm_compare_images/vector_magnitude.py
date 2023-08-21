# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    Image,
)

def vector_magnitude(
    vector_image: Image,
) -> Image:
    """Generate a scalar magnitude image based on the input vector's norm.

    :param vector_image: Input vector image
    :type  vector_image: Image

    :return: Output magnitude image
    :rtype:  Image
    """
    func = environment_dispatch("itkwasm_compare_images", "vector_magnitude")
    output = func(vector_image)
    return output
