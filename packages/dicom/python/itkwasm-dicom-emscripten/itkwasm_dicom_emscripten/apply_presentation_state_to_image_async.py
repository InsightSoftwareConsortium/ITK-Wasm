# Generated file. Do not edit.

from pathlib import Path
import os
from typing import Dict, Tuple

from .pyodide import js_package

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)

async def apply_presentation_state_to_image_async(
    image_in: os.PathLike,
    presentation_state_file: os.PathLike,
    config_file: str = "",
    frame: int = 1,
    presentation_state_output: bool = False,
    bitmap_output: bool = False,
    pgm: bool = False,
    dicom: bool = False,
) -> Tuple[Dict, Image]:
    """Apply a presentation state to a given DICOM image and render output as pgm bitmap or dicom file.

    :param image_in: Input DICOM file
    :type  image_in: os.PathLike

    :param presentation_state_file: Process using presentation state file
    :type  presentation_state_file: os.PathLike

    :param config_file: filename: string. Process using settings from configuration file
    :type  config_file: str

    :param frame: frame: integer. Process using image frame f (default: 1)
    :type  frame: int

    :param presentation_state_output: get presentation state information in text stream (default: ON).
    :type  presentation_state_output: bool

    :param bitmap_output: get resulting image as bitmap output stream (default: ON).
    :type  bitmap_output: bool

    :param pgm: save image as PGM (default)
    :type  pgm: bool

    :param dicom: save image as DICOM secondary capture
    :type  dicom: bool

    :return: Output overlay information
    :rtype:  Dict

    :return: Output image
    :rtype:  Image
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    outputs = await js_module.applyPresentationStateToImage(web_worker, to_js(image_in), to_js(presentation_state_file),  configFile=to_js(config_file), frame=to_js(frame), presentationStateOutput=to_js(presentation_state_output), bitmapOutput=to_js(bitmap_output), pgm=to_js(pgm), dicom=to_js(dicom), )

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
