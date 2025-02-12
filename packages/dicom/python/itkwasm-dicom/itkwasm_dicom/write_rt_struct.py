# Generated file. Do not edit.

import os
from typing import Dict, Tuple, Optional, List, Any

from itkwasm import (
    environment_dispatch,
    TextFile,
    BinaryFile,
)

def write_rt_struct(
    input_cxt: os.PathLike,
    output_dicom: str,
    dicom_metadata: Optional[Any] = None,
) -> os.PathLike:
    """Write a DICOM RT Struct Structured Set for the given ROI contours and DICOM metadata

    :param input_cxt: Input Plastimatch CXT structure set file
    :type  input_cxt: os.PathLike

    :param output_dicom: Output DICOM RT Struct Structure Set file
    :type  output_dicom: str

    :param dicom_metadata: Additional DICOM metadata
    :type  dicom_metadata: Any
    """
    func = environment_dispatch("itkwasm_dicom", "write_rt_struct")
    output = func(input_cxt, output_dicom, dicom_metadata=dicom_metadata)
    return output
