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
)

async def downsample_bin_shrink_async(
    input: Image,
    shrink_factors: List[int] = [],
    information_only: bool = False,
) -> Image:
    """Apply local averaging and subsample the input image.

    :param input: Input image
    :type  input: Image

    :param shrink_factors: Shrink factors
    :type  shrink_factors: int

    :param information_only: Generate output image information only. Do not process pixels.
    :type  information_only: bool

    :return: Output downsampled image
    :rtype:  Image
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if shrink_factors:
        kwargs["shrinkFactors"] = to_js(shrink_factors)
    if information_only:
        kwargs["informationOnly"] = to_js(information_only)

    outputs = await js_module.downsampleBinShrink(to_js(input), webWorker=web_worker, noCopy=True, **kwargs)

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
