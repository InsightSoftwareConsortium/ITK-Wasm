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

def resample_to_reference(
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
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_downsample_wasi').joinpath(Path('wasm_modules') / Path('resample-to-reference.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.Image),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.Image, input),
        PipelineInput(InterfaceTypes.Image, reference_image),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    args.append('0')
    args.append('1')
    # Outputs
    output_name = '0'
    args.append(output_name)

    # Options
    input_count = len(pipeline_inputs)
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

