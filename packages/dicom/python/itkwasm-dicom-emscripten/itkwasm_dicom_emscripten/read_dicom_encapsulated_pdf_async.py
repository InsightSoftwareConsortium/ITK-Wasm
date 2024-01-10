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
    BinaryStream,
)

async def read_dicom_encapsulated_pdf_async(
    dicom_file: os.PathLike,
    read_file_only: bool = False,
    read_dataset: bool = False,
    read_xfer_auto: bool = False,
    read_xfer_detect: bool = False,
    read_xfer_little: bool = False,
    read_xfer_big: bool = False,
    read_xfer_implicit: bool = False,
    accept_odd_length: bool = False,
    assume_even_length: bool = False,
    enable_cp246: bool = False,
    disable_cp246: bool = False,
    retain_un: bool = False,
    convert_un: bool = False,
    enable_correction: bool = False,
    disable_correction: bool = False,
) -> bytes:
    """Extract PDF file from DICOM encapsulated PDF.

    :param dicom_file: Input DICOM file
    :type  dicom_file: os.PathLike

    :param read_file_only: read file format only
    :type  read_file_only: bool

    :param read_dataset: read data set without file meta information
    :type  read_dataset: bool

    :param read_xfer_auto: use TS recognition (default)
    :type  read_xfer_auto: bool

    :param read_xfer_detect: ignore TS specified in the file meta header
    :type  read_xfer_detect: bool

    :param read_xfer_little: read with explicit VR little endian TS
    :type  read_xfer_little: bool

    :param read_xfer_big: read with explicit VR big endian TS
    :type  read_xfer_big: bool

    :param read_xfer_implicit: read with implicit VR little endian TS
    :type  read_xfer_implicit: bool

    :param accept_odd_length: accept odd length attributes (default)
    :type  accept_odd_length: bool

    :param assume_even_length: assume real length is one byte larger
    :type  assume_even_length: bool

    :param enable_cp246: read undefined len UN as implicit VR (default)
    :type  enable_cp246: bool

    :param disable_cp246: read undefined len UN as explicit VR
    :type  disable_cp246: bool

    :param retain_un: retain elements as UN (default)
    :type  retain_un: bool

    :param convert_un: convert to real VR if known
    :type  convert_un: bool

    :param enable_correction: enable automatic data correction (default)
    :type  enable_correction: bool

    :param disable_correction: disable automatic data correction
    :type  disable_correction: bool

    :return: Output pdf file
    :rtype:  bytes
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if read_file_only:
        kwargs["readFileOnly"] = to_js(read_file_only)
    if read_dataset:
        kwargs["readDataset"] = to_js(read_dataset)
    if read_xfer_auto:
        kwargs["readXferAuto"] = to_js(read_xfer_auto)
    if read_xfer_detect:
        kwargs["readXferDetect"] = to_js(read_xfer_detect)
    if read_xfer_little:
        kwargs["readXferLittle"] = to_js(read_xfer_little)
    if read_xfer_big:
        kwargs["readXferBig"] = to_js(read_xfer_big)
    if read_xfer_implicit:
        kwargs["readXferImplicit"] = to_js(read_xfer_implicit)
    if accept_odd_length:
        kwargs["acceptOddLength"] = to_js(accept_odd_length)
    if assume_even_length:
        kwargs["assumeEvenLength"] = to_js(assume_even_length)
    if enable_cp246:
        kwargs["enableCp246"] = to_js(enable_cp246)
    if disable_cp246:
        kwargs["disableCp246"] = to_js(disable_cp246)
    if retain_un:
        kwargs["retainUn"] = to_js(retain_un)
    if convert_un:
        kwargs["convertUn"] = to_js(convert_un)
    if enable_correction:
        kwargs["enableCorrection"] = to_js(enable_correction)
    if disable_correction:
        kwargs["disableCorrection"] = to_js(disable_correction)

    outputs = await js_module.readDicomEncapsulatedPdf(to_js(BinaryFile(dicom_file)), webWorker=web_worker, noCopy=True, **kwargs)

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
