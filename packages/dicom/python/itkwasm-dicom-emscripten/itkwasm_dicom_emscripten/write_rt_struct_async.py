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
    TextFile,
    BinaryFile,
)

async def write_rt_struct_async(
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
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if dicom_metadata is not None:
        kwargs["dicomMetadata"] = to_js(dicom_metadata)

    outputs = await js_module.writeRtStruct(to_js(TextFile(input_cxt)), to_js(output_dicom), webWorker=web_worker, noCopy=True, **kwargs)

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
