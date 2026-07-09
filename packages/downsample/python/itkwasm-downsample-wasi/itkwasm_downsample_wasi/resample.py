# Generated file. To retain edits, remove this comment.

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
    TransformList,
)

def resample(
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
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_downsample_wasi').joinpath(Path('wasm_modules') / Path('resample.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.Image),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.Image, input),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    args.append('0')
    # Outputs
    output_name = '0'
    args.append(output_name)

    # Options
    input_count = len(pipeline_inputs)
    if size is not None and len(size) < 1:
       raise ValueError('"size" kwarg must have a length > 1')
    if size is not None and len(size) > 0:
        args.append('--size')
        for value in size:
            args.append(str(value))

    if output_spacing is not None and len(output_spacing) < 1:
       raise ValueError('"output-spacing" kwarg must have a length > 1')
    if output_spacing is not None and len(output_spacing) > 0:
        args.append('--output-spacing')
        for value in output_spacing:
            args.append(str(value))

    if output_origin is not None and len(output_origin) < 1:
       raise ValueError('"output-origin" kwarg must have a length > 1')
    if output_origin is not None and len(output_origin) > 0:
        args.append('--output-origin')
        for value in output_origin:
            args.append(str(value))

    if output_direction is not None and len(output_direction) < 1:
       raise ValueError('"output-direction" kwarg must have a length > 1')
    if output_direction is not None and len(output_direction) > 0:
        args.append('--output-direction')
        for value in output_direction:
            args.append(str(value))

    if transform is not None:
        pipeline_inputs.append(PipelineInput(InterfaceTypes.TransformList, transform))
        args.append('--transform')
        args.append(str(input_count))
        input_count += 1

    if interpolator:
        if interpolator not in ('linear','nearest_neighbor','label_image','b_spline','windowed_sinc','gaussian'):
            raise ValueError(f'interpolator must be one of linear, nearest_neighbor, label_image, b_spline, windowed_sinc, gaussian')
        args.append('--interpolator')
        args.append(str(interpolator))

    if default_value is not None:
        args.append('--default-value')
        args.append(str(default_value))


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = outputs[0].data
    return result

