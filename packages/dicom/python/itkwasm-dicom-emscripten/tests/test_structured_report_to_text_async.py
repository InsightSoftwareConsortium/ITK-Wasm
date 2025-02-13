import pytest
import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide
from pytest_pyodide.decorator import copy_files_to_pyodide
from .fixtures import input_file_list

file_list = input_file_list()

@copy_files_to_pyodide(file_list=file_list,install_wheels=True)
@run_in_pyodide
async def test_structured_report_to_text(selenium):
    from pathlib import Path

    from itkwasm_dicom_emscripten import structured_report_to_text_async

    test_file_path = '88.33-comprehensive-SR.dcm'
    assert Path(test_file_path).exists()

    output_text = await structured_report_to_text_async(test_file_path)
    assert output_text.find('Comprehensive SR Document') != -1
    assert output_text.find('Pathology') != -1

    output_text = await structured_report_to_text_async(test_file_path, no_document_header=True)
    assert output_text.find('Comprehensive SR Document') == -1
    assert output_text.find('Breast Imaging Report') != -1
    assert output_text.find('Pathology') != -1