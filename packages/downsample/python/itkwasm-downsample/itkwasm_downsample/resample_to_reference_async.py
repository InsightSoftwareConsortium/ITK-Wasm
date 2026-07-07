# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    Image,
    TransformList,
)

async def resample_to_reference_async(
    input: Image,
    reference_image: Image,
    transform: Optional[TransformList] = None,
    interpolator: str = "linear",
    default_value: float = 0,
) -> Image:
    """Resample an image onto a reference image's grid with an optional transform and a selectable interpolator.

    :param input: The moving image to resample.
    :type  input: Image

    :param reference_image: Reference image whose geometry defines the output grid. Only the geometry (origin, spacing, direction, size) is used; the pixel values are ignored.
    :type  reference_image: Image

    :param transform: Optional transform mapping output-grid points into the moving-image space. A multi-entry or composite list is composed with itk::CompositeTransform semantics: the last entry is applied to the point first. Defaults to identity.
    :type  transform: TransformList

    :param interpolator: Interpolation method used to sample the moving image.
    :type  interpolator: str

    :param default_value: Pixel value assigned to output samples that map outside the moving image (the background value), cast to the output pixel type. Defaults to 0.
    :type  default_value: float

    :return: The resampled output image.
    :rtype:  Image
    """
    func = environment_dispatch("itkwasm_downsample", "resample_to_reference_async")
    output = await func(input, reference_image, transform=transform, interpolator=interpolator, default_value=default_value)
    return output
