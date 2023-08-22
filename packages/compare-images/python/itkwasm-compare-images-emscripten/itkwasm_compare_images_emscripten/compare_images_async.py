from pathlib import Path
import os
from typing import Dict, Tuple, Optional, List

from .js_package import js_package

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)
from itkwasm import (
    InterfaceTypes,
    Image,
)

async def compare_images_async(
    test_image: Image,
    baseline_images: List[Image] = [],
    difference_threshold: float = 0,
    radius_tolerance: int = 0,
    number_of_pixels_tolerance: int = 0,
    ignore_boundary_pixels: bool = False,
) -> Tuple[Dict, Image, Image]:
    """Compare double pixel type images with a tolerance for regression testing.

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
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if baseline_images is not None:
        kwargs["baselineImages"] = to_js(baseline_images)
    if difference_threshold:
        kwargs["differenceThreshold"] = to_js(difference_threshold)
    if radius_tolerance:
        kwargs["radiusTolerance"] = to_js(radius_tolerance)
    if number_of_pixels_tolerance:
        kwargs["numberOfPixelsTolerance"] = to_js(number_of_pixels_tolerance)
    if ignore_boundary_pixels:
        kwargs["ignoreBoundaryPixels"] = to_js(ignore_boundary_pixels)

    outputs = await js_module.compareImages(web_worker, to_js(test_image), **kwargs)

    output_web_worker = None
    output_list = []
    outputs_object_map = outputs.as_object_map()
    for output_name in outputs.object_keys():
        if output_name == 'webWorker':
            output_web_worker = outputs_object_map[output_name]
        else:
            output_list.append(to_py(outputs_object_map[output_name]))

    js_resources.web_worker = output_web_worker

    if len(output_list) == 1:
        return output_list[0]
    return tuple(output_list)
