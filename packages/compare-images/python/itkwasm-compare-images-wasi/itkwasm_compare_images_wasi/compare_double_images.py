from pathlib import Path, PurePosixPath
import os
from typing import Dict, Tuple, Optional, List, Any

from importlib_resources import files as file_resources

_pipeline = None

from itkwasm import (
    InterfaceTypes,
    PipelineOutput,
    PipelineInput,
    Pipeline,
    Image,
)

def compare_double_images(
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
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_compare_images_wasi').joinpath(Path('wasm_modules') / Path('compare-double-images.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.JsonCompatible),
        PipelineOutput(InterfaceTypes.Image),
        PipelineOutput(InterfaceTypes.Image),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.Image, test_image),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    args.append('0')
    # Outputs
    args.append('0')
    args.append('1')
    args.append('2')
    # Options
    if len(baseline_images) < 1:
       raise ValueError('"baseline-images" kwarg must have a length > 1')
    if len(baseline_images) > 0:
        args.append('--baseline-images')
        for value in baseline_images:
            input_count_string = str(len(pipeline_inputs))
            pipeline_inputs.append(PipelineInput(InterfaceTypes.Image, value))
            args.append(input_count_string)

    if difference_threshold:
        args.append('--difference-threshold')
        args.append(str(difference_threshold))

    if radius_tolerance:
        args.append('--radius-tolerance')
        args.append(str(radius_tolerance))

    if number_of_pixels_tolerance:
        args.append('--number-of-pixels-tolerance')
        args.append(str(number_of_pixels_tolerance))

    if ignore_boundary_pixels:
        args.append('--ignore-boundary-pixels')


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = (
        outputs[0].data,
        outputs[1].data,
        outputs[2].data,
    )
    return result

