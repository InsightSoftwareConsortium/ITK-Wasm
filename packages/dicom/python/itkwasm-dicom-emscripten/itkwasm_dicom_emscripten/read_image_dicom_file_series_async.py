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
    BinaryFile,
)

async def read_image_dicom_file_series_async(
    input_images: List[os.PathLike] = [],
    single_sorted_series: bool = False,
) -> Tuple[Image, List[str]]:
    """Read a DICOM image series and return the associated image volume

    :param input_images: File names in the series
    :type  input_images: os.PathLike

    :param single_sorted_series: The input files are a single sorted series
    :type  single_sorted_series: bool

    :return: Output image volume
    :rtype:  Image

    :return: Output sorted filenames
    :rtype:  List[str]
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if input_images is not None:
        kwargs["inputImages"] = to_js(BinaryFile(input_images))
    if single_sorted_series:
        kwargs["singleSortedSeries"] = to_js(single_sorted_series)

    outputs = await js_module.readImageDicomFileSeries(webWorker=web_worker, noCopy=True, **kwargs)

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
