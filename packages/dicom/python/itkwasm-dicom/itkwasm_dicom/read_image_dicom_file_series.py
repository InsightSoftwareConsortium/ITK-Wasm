# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    Image,
    BinaryFile,
)

def read_image_dicom_file_series(
    input_images: List[os.PathLike] = [],
    single_sorted_series: bool = False,
) -> Tuple[Image, Any]:
    """Read a DICOM image series and return the associated image volume

    :param input_images: File names in the series
    :type  input_images: os.PathLike

    :param single_sorted_series: The input files are a single sorted series
    :type  single_sorted_series: bool

    :return: Output image volume
    :rtype:  Image

    :return: Output sorted filenames
    :rtype:  Any
    """
    func = environment_dispatch("itkwasm_dicom", "read_image_dicom_file_series")
    output = func(input_images=input_images, single_sorted_series=single_sorted_series)
    return output
