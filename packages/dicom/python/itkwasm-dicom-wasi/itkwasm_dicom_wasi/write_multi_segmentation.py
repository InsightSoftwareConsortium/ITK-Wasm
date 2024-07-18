# Generated file. To retain edits, remove this comment.

from pathlib import Path, PurePosixPath
import os
from typing import Dict, Tuple, Optional, List, Any

from importlib_resources import files as file_resources

_pipeline = None

from itkwasm import (
    InterfaceTypes,
    PipelineOutput,
    PipelineInput,
    Pipeline,
    BinaryFile,
)

def write_multi_segmentation(
    meta_info: Any,
    output_dicom_file: str,
    ref_dicom_series: List[os.PathLike] = [],
    seg_images: List[os.PathLike] = [],
    skip_empty_slices: bool = False,
    use_labelid_as_segmentnumber: bool = False,
) -> os.PathLike:
    """Write DICOM segmentation object using multiple input images.

    :param meta_info: JSON file containing the meta-information that describesthe measurements to be encoded. See DCMQI documentation for details.
    :type  meta_info: Any

    :param output_dicom_file: File name of the DICOM SEG object that will store theresult of conversion.
    :type  output_dicom_file: str

    :param ref_dicom_series: List of DICOM files that correspond to the original.image that was segmented.
    :type  ref_dicom_series: os.PathLike

    :param seg_images: List of input segmentation images.image that was segmented.
    :type  seg_images: os.PathLike

    :param skip_empty_slices: Skip empty slices while encoding segmentation image.By default, empty slices will not be encoded, resulting in a smaller output file size.
    :type  skip_empty_slices: bool

    :param use_labelid_as_segmentnumber: Use label IDs from ITK images asSegment Numbers in DICOM. Only works if label IDs are consecutively numbered starting from 1, otherwise conversion will fail.
    :type  use_labelid_as_segmentnumber: bool
    """
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_dicom_wasi').joinpath(Path('wasm_modules') / Path('write-multi-segmentation.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(output_dicom_file))),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.JsonCompatible, meta_info),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    args.append('0')
    # Outputs
    output_dicom_file_name = str(PurePosixPath(output_dicom_file))
    args.append(output_dicom_file_name)

    # Options
    input_count = len(pipeline_inputs)
    if len(ref_dicom_series) < 1:
       raise ValueError('"ref-dicom-series" kwarg must have a length > 1')
    if len(ref_dicom_series) > 0:
        args.append('--ref-dicom-series')
        for value in ref_dicom_series:
            input_file = str(PurePosixPath(value))
            pipeline_inputs.append(PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(value)))
            args.append(input_file)

    if len(seg_images) < 1:
       raise ValueError('"seg-images" kwarg must have a length > 1')
    if len(seg_images) > 0:
        args.append('--seg-images')
        for value in seg_images:
            input_file = str(PurePosixPath(value))
            pipeline_inputs.append(PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(value)))
            args.append(input_file)

    if skip_empty_slices:
        args.append('--skip-empty-slices')

    if use_labelid_as_segmentnumber:
        args.append('--use-labelid-as-segmentnumber')


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)


