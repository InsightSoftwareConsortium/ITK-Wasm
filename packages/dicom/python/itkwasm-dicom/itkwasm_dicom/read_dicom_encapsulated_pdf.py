# Generated file. Do not edit.

from typing import Optional

from itkwasm import (
    environment_dispatch,
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
    func = environment_dispatch("itkwasm_dicom", "read_dicom_encapsulated_pdf")
    output = func(dicom_file, read_file_only=read_file_only, read_dataset=read_dataset, read_xfer_auto=read_xfer_auto, read_xfer_detect=read_xfer_detect, read_xfer_little=read_xfer_little, read_xfer_big=read_xfer_big, read_xfer_implicit=read_xfer_implicit, accept_odd_length=accept_odd_length, assume_even_length=assume_even_length, enable_cp246=enable_cp246, disable_cp246=disable_cp246, retain_un=retain_un, convert_un=convert_un, enable_correction=enable_correction, disable_correction=disable_correction)
    return output
