# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    BinaryFile,
)

def image_sets_normalization(
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
    func = environment_dispatch("itkwasm_dicom", "image_sets_normalization")
    output = func(files=files, series_group_by=series_group_by, image_set_group_by=image_set_group_by)
    return output
