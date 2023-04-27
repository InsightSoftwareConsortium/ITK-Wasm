# Generated file. Do not edit.

from pathlib import Path
import os
from typing import Dict, Tuple

from .pyodide import js_package

from itkwasm.pyodide import (
    to_js,
    to_py,
    js_resources
)

async def structured_report_to_text_async(
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
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    outputs = await js_module.structuredReportToText(web_worker, to_js(dicom_file),  unknownRelationship=to_js(unknown_relationship), invalidItemValue=to_js(invalid_item_value), ignoreConstraints=to_js(ignore_constraints), ignoreItemErrors=to_js(ignore_item_errors), skipInvalidItems=to_js(skip_invalid_items), noDocumentHeader=to_js(no_document_header), numberNestedItems=to_js(number_nested_items), shortenLongValues=to_js(shorten_long_values), printInstanceUid=to_js(print_instance_uid), printSopclassShort=to_js(print_sopclass_short), printSopclassLong=to_js(print_sopclass_long), printSopclassUid=to_js(print_sopclass_uid), printAllCodes=to_js(print_all_codes), printInvalidCodes=to_js(print_invalid_codes), printTemplateId=to_js(print_template_id), indicateEnhanced=to_js(indicate_enhanced), printColor=to_js(print_color), )

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
