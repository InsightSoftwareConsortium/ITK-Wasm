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
    TextStream,
    TextFile,
)

def structured_report_to_html(
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
    global _pipeline
    if _pipeline is None:
        _pipeline = Pipeline(file_resources('itkwasm_dicom_wasi').joinpath(Path('wasm_modules') / Path('structured-report-to-html.wasi.wasm')))

    pipeline_outputs: List[PipelineOutput] = [
        PipelineOutput(InterfaceTypes.TextStream),
    ]

    pipeline_inputs: List[PipelineInput] = [
        PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(PurePosixPath(dicom_file))),
    ]

    args: List[str] = ['--memory-io',]
    # Inputs
    if not Path(dicom_file).exists():
        raise FileNotFoundError("dicom_file does not exist")
    args.append(str(PurePosixPath(dicom_file)))
    # Outputs
    output_text_name = '0'
    args.append(output_text_name)

    # Options
    input_count = len(pipeline_inputs)
    if read_file_only:
        args.append('--read-file-only')

    if read_dataset:
        args.append('--read-dataset')

    if read_xfer_auto:
        args.append('--read-xfer-auto')

    if read_xfer_detect:
        args.append('--read-xfer-detect')

    if read_xfer_little:
        args.append('--read-xfer-little')

    if read_xfer_big:
        args.append('--read-xfer-big')

    if read_xfer_implicit:
        args.append('--read-xfer-implicit')

    if processing_details:
        args.append('--processing-details')

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

    if disable_vr_checker:
        args.append('--disable-vr-checker')

    if charset_require:
        args.append('--charset-require')

    if charset_assume:
        args.append('--charset-assume')
        args.append(str(charset_assume))

    if charset_check_all:
        args.append('--charset-check-all')

    if convert_to_utf8:
        args.append('--convert-to-utf8')

    if url_prefix:
        args.append('--url-prefix')
        args.append(str(url_prefix))

    if html_32:
        args.append('--html-32')

    if html_40:
        args.append('--html-40')

    if xhtml_11:
        args.append('--xhtml-11')

    if add_document_type:
        args.append('--add-document-type')

    if css_reference is not None:
        pipeline_inputs.append(PipelineInput(InterfaceTypes.TextStream, TextStream(css_reference)))
        args.append('--css-reference')
        args.append(str(input_count))
        input_count += 1

    if css_file is not None:
        input_file = str(PurePosixPath(css_file))
        pipeline_inputs.append(PipelineInput(InterfaceTypes.TextFile, TextFile(css_file)))
        args.append('--css-file')
        args.append(input_file)

    if expand_inline:
        args.append('--expand-inline')

    if never_expand_inline:
        args.append('--never-expand-inline')

    if always_expand_inline:
        args.append('--always-expand-inline')

    if render_full_data:
        args.append('--render-full-data')

    if section_title_inline:
        args.append('--section-title-inline')

    if document_type_title:
        args.append('--document-type-title')

    if patient_info_title:
        args.append('--patient-info-title')

    if no_document_header:
        args.append('--no-document-header')

    if render_inline_codes:
        args.append('--render-inline-codes')

    if concept_name_codes:
        args.append('--concept-name-codes')

    if numeric_unit_codes:
        args.append('--numeric-unit-codes')

    if code_value_unit:
        args.append('--code-value-unit')

    if code_meaning_unit:
        args.append('--code-meaning-unit')

    if render_all_codes:
        args.append('--render-all-codes')

    if code_details_tooltip:
        args.append('--code-details-tooltip')


    outputs = _pipeline.run(args, pipeline_outputs, pipeline_inputs)

    result = outputs[0].data.data
    return result

