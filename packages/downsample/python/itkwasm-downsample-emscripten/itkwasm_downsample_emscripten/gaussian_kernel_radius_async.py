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
)

async def gaussian_kernel_radius_async(
    size: List[int] = [],
    sigma: List[float] = [],
    max_kernel_width: int = 32,
    max_kernel_error: float = 0.01,
) -> Any:
    """Radius in pixels required for effective discrete gaussian filtering.

    :param size: Size in pixels
    :type  size: int

    :param sigma: Sigma in pixel units
    :type  sigma: float

    :param max_kernel_width: Maximum kernel width in pixels.
    :type  max_kernel_width: int

    :param max_kernel_error: Maximum kernel error.
    :type  max_kernel_error: float

    :return: Output kernel radius.
    :rtype:  Any
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if size:
        kwargs["size"] = to_js(size)
    if sigma:
        kwargs["sigma"] = to_js(sigma)
    if max_kernel_width:
        kwargs["maxKernelWidth"] = to_js(max_kernel_width)
    if max_kernel_error:
        kwargs["maxKernelError"] = to_js(max_kernel_error)

    outputs = await js_module.gaussianKernelRadius(webWorker=web_worker, noCopy=True, **kwargs)

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
