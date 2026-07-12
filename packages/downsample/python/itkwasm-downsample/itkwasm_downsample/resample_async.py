# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    Image,
    TransformList,
)

async def resample_async(
    input: Image,
    size: Optional[List[int]] = None,
    output_spacing: Optional[List[float]] = None,
    output_origin: Optional[List[float]] = None,
    output_direction: Optional[List[float]] = None,
    transform: Optional[TransformList] = None,
    interpolator: str = "linear",
    default_value: float = 0,
) -> Image:
    """Resample an image onto an explicitly parameterized output grid with an optional transform and a selectable interpolator.

    :param input: The moving image to resample.
    :type  input: Image

    :param size: Output size in pixels per axis. Defaults to the input size; when --output-spacing is given without --size, the size is auto-computed to preserve the input's physical extent at the new spacing.
    :type  size: int

    :param output_spacing: Output spacing per axis in physical units. Defaults to the input spacing.
    :type  output_spacing: float

    :param output_origin: Output origin, the physical coordinates of the first pixel, per axis. Defaults to the input origin.
    :type  output_origin: float

    :param output_direction: Output direction as the D-by-D orientation matrix, flattened row-major (D values per row). Defaults to the input direction.
    :type  output_direction: float

    :param transform: Optional transform mapping output-grid points into the moving-image space. A multi-entry or composite list is composed with itk::CompositeTransform semantics: the last entry is applied to the point first. Defaults to identity.
    :type  transform: TransformList

    :param interpolator: Interpolation method used to sample the moving image.
    :type  interpolator: str

    :param default_value: Pixel value assigned to output samples that map outside the moving image (the background value), cast to the output pixel type. Defaults to 0.
    :type  default_value: float

    :return: The resampled output image.
    :rtype:  Image
    """
    func = environment_dispatch("itkwasm_downsample", "resample_async")
    output = await func(input, size=size, output_spacing=output_spacing, output_origin=output_origin, output_direction=output_direction, transform=transform, interpolator=interpolator, default_value=default_value)
    return output
