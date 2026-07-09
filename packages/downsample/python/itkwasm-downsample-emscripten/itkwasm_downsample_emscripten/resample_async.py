# Generated file. To retain edits, remove this comment.

from pathlib import Path
import os
from typing import Dict, Tuple, Optional, List, Any

from .js_package import js_package

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)
from itkwasm import (
    InterfaceTypes,
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
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if size:
        kwargs["size"] = to_js(size)
    if output_spacing:
        kwargs["outputSpacing"] = to_js(output_spacing)
    if output_origin:
        kwargs["outputOrigin"] = to_js(output_origin)
    if output_direction:
        kwargs["outputDirection"] = to_js(output_direction)
    if transform is not None:
        kwargs["transform"] = to_js(transform)
    if interpolator:
        kwargs["interpolator"] = to_js(interpolator)
    if default_value is not None:
        kwargs["defaultValue"] = to_js(default_value)

    outputs = await js_module.resample(to_js(input), webWorker=web_worker, noCopy=True, **kwargs)

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
