# Generated file. Do not edit.

from typing import Optional

from itkwasm import (
    environment_dispatch,
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
    func = environment_dispatch("itkwasm_dicom", "structured_report_to_text")
    output = func(dicom_file, unknown_relationship=unknown_relationship, invalid_item_value=invalid_item_value, ignore_constraints=ignore_constraints, ignore_item_errors=ignore_item_errors, skip_invalid_items=skip_invalid_items, no_document_header=no_document_header, number_nested_items=number_nested_items, shorten_long_values=shorten_long_values, print_instance_uid=print_instance_uid, print_sopclass_short=print_sopclass_short, print_sopclass_long=print_sopclass_long, print_sopclass_uid=print_sopclass_uid, print_all_codes=print_all_codes, print_invalid_codes=print_invalid_codes, print_template_id=print_template_id, indicate_enhanced=indicate_enhanced, print_color=print_color)
    return output
