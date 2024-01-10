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
    BinaryFile,
    TextStream,
    TextFile,
)

async def structured_report_to_html_async(
    dicom_file: os.PathLike,
    read_file_only: bool = False,
    read_dataset: bool = False,
    read_xfer_auto: bool = False,
    read_xfer_detect: bool = False,
    read_xfer_little: bool = False,
    read_xfer_big: bool = False,
    read_xfer_implicit: bool = False,
    processing_details: bool = False,
    unknown_relationship: bool = False,
    invalid_item_value: bool = False,
    ignore_constraints: bool = False,
    ignore_item_errors: bool = False,
    skip_invalid_items: bool = False,
    disable_vr_checker: bool = False,
    charset_require: bool = False,
    charset_assume: str = "",
    charset_check_all: bool = False,
    convert_to_utf8: bool = False,
    url_prefix: str = "",
    html_32: bool = False,
    html_40: bool = False,
    xhtml_11: bool = False,
    add_document_type: bool = False,
    css_reference: Optional[str] = None,
    css_file: Optional[os.PathLike] = None,
    expand_inline: bool = False,
    never_expand_inline: bool = False,
    always_expand_inline: bool = False,
    render_full_data: bool = False,
    section_title_inline: bool = False,
    document_type_title: bool = False,
    patient_info_title: bool = False,
    no_document_header: bool = False,
    render_inline_codes: bool = False,
    concept_name_codes: bool = False,
    numeric_unit_codes: bool = False,
    code_value_unit: bool = False,
    code_meaning_unit: bool = False,
    render_all_codes: bool = False,
    code_details_tooltip: bool = False,
) -> str:
    """Render DICOM SR file and data set to HTML/XHTML

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

    :param processing_details: show currently processed content item
    :type  processing_details: bool

    :param unknown_relationship: accept unknown/missing relationship type
    :type  unknown_relationship: bool

    :param invalid_item_value: accept invalid content item value (e.g. violation of VR or VM definition)
    :type  invalid_item_value: bool

    :param ignore_constraints: ignore relationship content constraints
    :type  ignore_constraints: bool

    :param ignore_item_errors: do not abort on content item errors, just warn (e.g. missing value type specific attributes)
    :type  ignore_item_errors: bool

    :param skip_invalid_items: skip invalid content items (incl. sub-tree)
    :type  skip_invalid_items: bool

    :param disable_vr_checker: disable check for VR-conformant string values
    :type  disable_vr_checker: bool

    :param charset_require: require declaration of ext. charset (default)
    :type  charset_require: bool

    :param charset_assume: [c]harset: string, assume charset c if no extended charset declared
    :type  charset_assume: str

    :param charset_check_all: check all data elements with string values (default: only PN, LO, LT, SH, ST, UC and UT)
    :type  charset_check_all: bool

    :param convert_to_utf8: convert all element values that are affected by Specific Character Set (0008,0005) to UTF-8
    :type  convert_to_utf8: bool

    :param url_prefix: URL: string. Append specificed URL prefix to hyperlinks of referenced composite objects in the document.
    :type  url_prefix: str

    :param html_32: use only HTML version 3.2 compatible features
    :type  html_32: bool

    :param html_40: allow all HTML version 4.01 features (default)
    :type  html_40: bool

    :param xhtml_11: comply with XHTML version 1.1 specification
    :type  xhtml_11: bool

    :param add_document_type: add reference to SGML document type definition
    :type  add_document_type: bool

    :param css_reference: URL: string. Add reference to specified CSS to document
    :type  css_reference: str

    :param css_file: [f]ilename: string. Embed content of specified CSS into document
    :type  css_file: os.PathLike

    :param expand_inline: expand short content items inline (default)
    :type  expand_inline: bool

    :param never_expand_inline: never expand content items inline
    :type  never_expand_inline: bool

    :param always_expand_inline: always expand content items inline
    :type  always_expand_inline: bool

    :param render_full_data: render full data of content items
    :type  render_full_data: bool

    :param section_title_inline: render section titles inline, not separately
    :type  section_title_inline: bool

    :param document_type_title: use document type as document title (default)
    :type  document_type_title: bool

    :param patient_info_title: use patient information as document title
    :type  patient_info_title: bool

    :param no_document_header: do not render general document information
    :type  no_document_header: bool

    :param render_inline_codes: render codes in continuous text blocks
    :type  render_inline_codes: bool

    :param concept_name_codes: render code of concept names
    :type  concept_name_codes: bool

    :param numeric_unit_codes: render code of numeric measurement units
    :type  numeric_unit_codes: bool

    :param code_value_unit: use code value as measurement unit (default)
    :type  code_value_unit: bool

    :param code_meaning_unit: use code meaning as measurement unit
    :type  code_meaning_unit: bool

    :param render_all_codes: render all codes (implies +Ci, +Cn and +Cu)
    :type  render_all_codes: bool

    :param code_details_tooltip: render code details as a tooltip (implies +Cc)
    :type  code_details_tooltip: bool

    :return: Output text file
    :rtype:  str
    """
    js_module = await js_package.js_module
    web_worker = js_resources.web_worker

    kwargs = {}
    if read_file_only:
        kwargs["readFileOnly"] = to_js(read_file_only)
    if read_dataset:
        kwargs["readDataset"] = to_js(read_dataset)
    if read_xfer_auto:
        kwargs["readXferAuto"] = to_js(read_xfer_auto)
    if read_xfer_detect:
        kwargs["readXferDetect"] = to_js(read_xfer_detect)
    if read_xfer_little:
        kwargs["readXferLittle"] = to_js(read_xfer_little)
    if read_xfer_big:
        kwargs["readXferBig"] = to_js(read_xfer_big)
    if read_xfer_implicit:
        kwargs["readXferImplicit"] = to_js(read_xfer_implicit)
    if processing_details:
        kwargs["processingDetails"] = to_js(processing_details)
    if unknown_relationship:
        kwargs["unknownRelationship"] = to_js(unknown_relationship)
    if invalid_item_value:
        kwargs["invalidItemValue"] = to_js(invalid_item_value)
    if ignore_constraints:
        kwargs["ignoreConstraints"] = to_js(ignore_constraints)
    if ignore_item_errors:
        kwargs["ignoreItemErrors"] = to_js(ignore_item_errors)
    if skip_invalid_items:
        kwargs["skipInvalidItems"] = to_js(skip_invalid_items)
    if disable_vr_checker:
        kwargs["disableVrChecker"] = to_js(disable_vr_checker)
    if charset_require:
        kwargs["charsetRequire"] = to_js(charset_require)
    if charset_assume:
        kwargs["charsetAssume"] = to_js(charset_assume)
    if charset_check_all:
        kwargs["charsetCheckAll"] = to_js(charset_check_all)
    if convert_to_utf8:
        kwargs["convertToUtf8"] = to_js(convert_to_utf8)
    if url_prefix:
        kwargs["urlPrefix"] = to_js(url_prefix)
    if html_32:
        kwargs["html32"] = to_js(html_32)
    if html_40:
        kwargs["html40"] = to_js(html_40)
    if xhtml_11:
        kwargs["xhtml11"] = to_js(xhtml_11)
    if add_document_type:
        kwargs["addDocumentType"] = to_js(add_document_type)
    if css_reference is not None:
        kwargs["cssReference"] = to_js(css_reference)
    if css_file is not None:
        kwargs["cssFile"] = to_js(TextFile(css_file))
    if expand_inline:
        kwargs["expandInline"] = to_js(expand_inline)
    if never_expand_inline:
        kwargs["neverExpandInline"] = to_js(never_expand_inline)
    if always_expand_inline:
        kwargs["alwaysExpandInline"] = to_js(always_expand_inline)
    if render_full_data:
        kwargs["renderFullData"] = to_js(render_full_data)
    if section_title_inline:
        kwargs["sectionTitleInline"] = to_js(section_title_inline)
    if document_type_title:
        kwargs["documentTypeTitle"] = to_js(document_type_title)
    if patient_info_title:
        kwargs["patientInfoTitle"] = to_js(patient_info_title)
    if no_document_header:
        kwargs["noDocumentHeader"] = to_js(no_document_header)
    if render_inline_codes:
        kwargs["renderInlineCodes"] = to_js(render_inline_codes)
    if concept_name_codes:
        kwargs["conceptNameCodes"] = to_js(concept_name_codes)
    if numeric_unit_codes:
        kwargs["numericUnitCodes"] = to_js(numeric_unit_codes)
    if code_value_unit:
        kwargs["codeValueUnit"] = to_js(code_value_unit)
    if code_meaning_unit:
        kwargs["codeMeaningUnit"] = to_js(code_meaning_unit)
    if render_all_codes:
        kwargs["renderAllCodes"] = to_js(render_all_codes)
    if code_details_tooltip:
        kwargs["codeDetailsTooltip"] = to_js(code_details_tooltip)

    outputs = await js_module.structuredReportToHtml(to_js(BinaryFile(dicom_file)), webWorker=web_worker, noCopy=True, **kwargs)

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
