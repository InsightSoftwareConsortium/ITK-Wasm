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
    BinaryFile,
)

async def image_sets_normalization_async(
    files: List[os.PathLike] = [],
    series_group_by: Optional[Any] = None,
    image_set_group_by: Optional[Any] = None,
) -> Any:
    """Group DICOM files into image sets

    :param files: DICOM files
    :type  files: os.PathLike

    :param series_group_by: Create series so that all instances in a series share these tags. Option is a JSON object with a "tags" array. Example tag: "0008|103e". If not provided, defaults to Series UID and Frame Of Reference UID tags.
    :type  series_group_by: Any

    :param image_set_group_by: Create image sets so that all series in a set share these tags. Option is a JSON object with a "tags" array. Example tag: "0008|103e". If not provided, defaults to Study UID tag.
    :type  image_set_group_by: Any

    :return: Image sets JSON
    :rtype:  Any
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if files is not None:
        kwargs["files"] = to_js(BinaryFile(files))
    if series_group_by is not None:
        kwargs["seriesGroupBy"] = to_js(series_group_by)
    if image_set_group_by is not None:
        kwargs["imageSetGroupBy"] = to_js(image_set_group_by)

    outputs = await js_module.imageSetsNormalization(webWorker=web_worker, noCopy=True, **kwargs)

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
