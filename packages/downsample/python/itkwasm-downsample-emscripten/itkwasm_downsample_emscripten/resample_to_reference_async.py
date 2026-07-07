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
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if transform is not None:
        kwargs["transform"] = to_js(transform)
    if interpolator:
        kwargs["interpolator"] = to_js(interpolator)
    if default_value is not None:
        kwargs["defaultValue"] = to_js(default_value)

    outputs = await js_module.resampleToReference(to_js(input), to_js(reference_image), webWorker=web_worker, noCopy=True, **kwargs)

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
