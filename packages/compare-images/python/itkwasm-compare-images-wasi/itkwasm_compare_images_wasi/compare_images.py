from typing import Dict, Tuple, Optional, List, Any
from .compare_double_images import compare_double_images
from .vector_magnitude import vector_magnitude

from itkwasm import (
    Image,
    FloatTypes,
    PixelTypes,
    cast_image,
)

def _to_scalar_double(image: Image) -> Image:
    scalar_double = image

    if scalar_double.imageType.componentType != FloatTypes.Float64:
        pixel_type = None
        if image.imageType.pixelType != PixelTypes.Scalar and image.imageType.pixelType != PixelTypes.VariableLengthVector:
            pixel_type = PixelTypes.VariableLengthVector
        scalar_double = cast_image(image, pixel_type=pixel_type, component_type=FloatTypes.Float64)
    else:
        if image.imageType.pixelType != PixelTypes.Scalar and image.imageType.pixelType != PixelTypes.VariableLengthVector:
            pixel_type = PixelTypes.VariableLengthVector
            scalar_double = cast_image(image, pixel_type=pixel_type)

    if scalar_double.imageType.pixelType == PixelTypes.VariableLengthVector:
        scalar_double = vector_magnitude(scalar_double)

    return scalar_double

def compare_images(
    test_image: Image,
    baseline_images: List[Image] = [],
    difference_threshold: float = 0,
    radius_tolerance: int = 0,
    number_of_pixels_tolerance: int = 0,
    ignore_boundary_pixels: bool = False,
) -> Tuple[Dict, Image, Image]:
    """Compare double pixel type images with a tolerance for regression testing.

    For multi-component images, the intensity difference threshold
    is based on the pixel vector magnitude.

    :param test_image: The input test image
    :type  test_image: Image

    :param baseline_images: Baseline images compare against
    :type  baseline_images: Image

    :param difference_threshold: Intensity difference for pixels to be considered different.
    :type  difference_threshold: float

    :param radius_tolerance: Radius of the neighborhood around a pixel to search for similar intensity values.
    :type  radius_tolerance: int

    :param number_of_pixels_tolerance: Number of pixels that can be different before the test fails.
    :type  number_of_pixels_tolerance: int

    :param ignore_boundary_pixels: Ignore boundary pixels. Useful when resampling may have introduced difference pixel values along the image edge.
    :type  ignore_boundary_pixels: bool

    :return: Metrics for the baseline with the fewest number of pixels outside the tolerances.
    :rtype:  Dict

    :return: Absolute difference image
    :rtype:  Image

    :return: Unsigned char, 2D difference image for rendering
    :rtype:  Image
    """
    test_image_double = _to_scalar_double(test_image)
    baseline_images_double = [_to_scalar_double(baseline_image) for baseline_image in baseline_images]

    return compare_double_images(test_image_double, baseline_images=baseline_images_double, difference_threshold=difference_threshold, radius_tolerance=radius_tolerance, number_of_pixels_tolerance=number_of_pixels_tolerance, ignore_boundary_pixels=ignore_boundary_pixels) 
