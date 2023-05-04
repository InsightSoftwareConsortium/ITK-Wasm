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
    TextStream,
)

def structured_report_to_text(
    dicom_file: os.PathLike,
    unknown_relationship: bool = False,
    invalid_item_value: bool = False,
    ignore_constraints: bool = False,
    ignore_item_errors: bool = False,
    skip_invalid_items: bool = False,
    no_document_header: bool = False,
    number_nested_items: bool = False,
    shorten_long_values: bool = False,
    print_instance_uid: bool = False,
    print_sopclass_short: bool = False,
    print_sopclass_long: bool = False,
    print_sopclass_uid: bool = False,
    print_all_codes: bool = False,
    print_invalid_codes: bool = False,
    print_template_id: bool = False,
    indicate_enhanced: bool = False,
    print_color: bool = False,
) -> str:
    """Read a DICOM structured report file and generate a plain text representation

    :param dicom_file: Input DICOM file
    :type  dicom_file: os.PathLike

    :param unknown_relationship: Accept unknown relationship type
    :type  unknown_relationship: bool

    :param invalid_item_value: Accept invalid content item value
    :type  invalid_item_value: bool

    :param ignore_constraints: Ignore relationship constraints
    :type  ignore_constraints: bool

    :param ignore_item_errors: Ignore content item errors
    :type  ignore_item_errors: bool

    :param skip_invalid_items: Skip invalid content items
    :type  skip_invalid_items: bool

    :param no_document_header: Print no document header
    :type  no_document_header: bool

    :param number_nested_items: Number nested items
    :type  number_nested_items: bool

    :param shorten_long_values: Shorten long item values
    :type  shorten_long_values: bool

    :param print_instance_uid: Print SOP Instance UID
    :type  print_instance_uid: bool

    :param print_sopclass_short: Print short SOP class name
    :type  print_sopclass_short: bool

    :param print_sopclass_long: Print SOP class name
    :type  print_sopclass_long: bool

    :param print_sopclass_uid: Print long SOP class name
    :type  print_sopclass_uid: bool

    :param print_all_codes: Print all codes
    :type  print_all_codes: bool

    :param print_invalid_codes: Print invalid codes
    :type  print_invalid_codes: bool

    :param print_template_id: Print template identification
    :type  print_template_id: bool

    :param indicate_enhanced: Indicate enhanced encoding mode
    :type  indicate_enhanced: bool

    :param print_color: Use ANSI escape codes
    :type  print_color: bool

    :return: Output text file
    :rtype:  str
    """
    pipeline = Pipeline(file_resources('itkwasm_dicom_wasi').joinpath(Path('wasm_modules') / Path('structured-report-to-text.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.TextStream),
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
    if unknown_relationship:
        args.append('--unknown-relationship')

    if invalid_item_value:
        args.append('--invalid-item-value')

    if ignore_constraints:
        args.append('--ignore-constraints')

    if ignore_item_errors:
        args.append('--ignore-item-errors')

    if skip_invalid_items:
        args.append('--skip-invalid-items')

    if no_document_header:
        args.append('--no-document-header')

    if number_nested_items:
        args.append('--number-nested-items')

    if shorten_long_values:
        args.append('--shorten-long-values')

    if print_instance_uid:
        args.append('--print-instance-uid')

    if print_sopclass_short:
        args.append('--print-sopclass-short')

    if print_sopclass_long:
        args.append('--print-sopclass-long')

    if print_sopclass_uid:
        args.append('--print-sopclass-uid')

    if print_all_codes:
        args.append('--print-all-codes')

    if print_invalid_codes:
        args.append('--print-invalid-codes')

    if print_template_id:
        args.append('--print-template-id')

    if indicate_enhanced:
        args.append('--indicate-enhanced')

    if print_color:
        args.append('--print-color')


    outputs = pipeline.run(args, pipeline_outputs, pipeline_inputs)

    del pipeline

    result = outputs[0].data.data
    return result

