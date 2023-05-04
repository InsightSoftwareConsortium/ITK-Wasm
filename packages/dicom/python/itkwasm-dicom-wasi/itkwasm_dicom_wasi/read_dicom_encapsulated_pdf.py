# Generated file. Do not edit.

from pathlib import Path, PurePosixPath
import os
from typing import Dict, Tuple, Optional

from importlib_resources import files as file_resources

from itkwasm import (
    InterfaceTypes,
    PipelineOutput,
    PipelineInput,
    Pipeline,
    BinaryFile,
    BinaryStream,
)

def read_dicom_encapsulated_pdf(
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
    pipeline = Pipeline(file_resources('itkwasm_dicom_wasi').joinpath(Path('wasm_modules') / Path('read-dicom-encapsulated-pdf.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.BinaryStream),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(dicom_file))),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    args.append(str(PurePosixPath(dicom_file)))
    # Outputs
    args.append('0')
    # Options
    if read_file_only:
        args.append('--read-file-only')

    if read_dataset:
        args.append('--read-dataset')

    if read_xfer_auto:
        args.append('--read-xfer-auto')

    if read_xfer_detect:
        args.append('--read-xfer-detect')

    if read_xfer_little:
        args.append('--read-xfer-little')

    if read_xfer_big:
        args.append('--read-xfer-big')

    if read_xfer_implicit:
        args.append('--read-xfer-implicit')

    if accept_odd_length:
        args.append('--accept-odd-length')

    if assume_even_length:
        args.append('--assume-even-length')

    if enable_cp246:
        args.append('--enable-cp246')

    if disable_cp246:
        args.append('--disable-cp246')

    if retain_un:
        args.append('--retain-un')

    if convert_un:
        args.append('--convert-un')

    if enable_correction:
        args.append('--enable-correction')

    if disable_correction:
        args.append('--disable-correction')


    outputs = pipeline.run(args, pipeline_outputs, pipeline_inputs)

    del pipeline

    result = outputs[0].data.data
    return result

