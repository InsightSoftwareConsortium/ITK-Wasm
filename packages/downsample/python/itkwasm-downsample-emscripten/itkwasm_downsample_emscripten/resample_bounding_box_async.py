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
    TransformList,
    Image,
)

async def resample_bounding_box_async(
    transform: TransformList,
    fixed: Image,
    moving: Image,
    padding: int = 1,
) -> Any:
    """Compute the padded moving-image region needed to resample the fixed image grid through a transform

    :param transform: Spatial transform mapping fixed image points into moving image space
    :type  transform: TransformList

    :param fixed: Fixed image whose grid is resampled (metadata only)
    :type  fixed: Image

    :param moving: Moving image to be sampled (metadata only)
    :type  moving: Image

    :param padding: Pixels of padding added per side (default 1 for linear interpolation)
    :type  padding: int

    :return: The padded moving-image region needed to resample the fixed image grid, as a bounding box (JSON)
    :rtype:  Any
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if padding is not None:
        kwargs["padding"] = to_js(padding)

    outputs = await js_module.resampleBoundingBox(to_js(transform), to_js(fixed), to_js(moving), webWorker=web_worker, noCopy=True, **kwargs)

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
