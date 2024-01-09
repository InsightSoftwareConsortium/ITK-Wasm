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
    Image,
)

async def apply_presentation_state_to_image_async(
    image_in: os.PathLike,
    presentation_state_file: os.PathLike,
    color_output: bool = False,
    config_file: str = "",
    frame: int = 1,
    no_presentation_state_output: bool = False,
    no_bitmap_output: bool = False,
) -> Tuple[Dict, Image]:
    """Apply a presentation state to a given DICOM image and render output as bitmap, or dicom file.

    :param image_in: Input DICOM file
    :type  image_in: os.PathLike

    :param presentation_state_file: Process using presentation state file
    :type  presentation_state_file: os.PathLike

    :param color_output: output image as RGB (default: false)
    :type  color_output: bool

    :param config_file: filename: string. Process using settings from configuration file
    :type  config_file: str

    :param frame: frame: integer. Process using image frame f (default: 1)
    :type  frame: int

    :param no_presentation_state_output: Do not get presentation state information in text stream.
    :type  no_presentation_state_output: bool

    :param no_bitmap_output: Do not get resulting image as bitmap output stream.
    :type  no_bitmap_output: bool

    :return: Output overlay information
    :rtype:  Dict

    :return: Output image
    :rtype:  Image
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if color_output:
        kwargs["colorOutput"] = to_js(color_output)
    if config_file:
        kwargs["configFile"] = to_js(config_file)
    if frame:
        kwargs["frame"] = to_js(frame)
    if no_presentation_state_output:
        kwargs["noPresentationStateOutput"] = to_js(no_presentation_state_output)
    if no_bitmap_output:
        kwargs["noBitmapOutput"] = to_js(no_bitmap_output)

    outputs = await js_module.applyPresentationStateToImage(to_js(BinaryFile(image_in)), to_js(BinaryFile(presentation_state_file)), webWorker=web_worker, noCopy=True, **kwargs)

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
