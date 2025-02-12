import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide
from pytest_pyodide.decorator import copy_files_to_pyodide
from .fixtures import input_file_list

file_list = input_file_list()

@copy_files_to_pyodide(file_list=file_list,install_wheels=True)
@run_in_pyodide
async def test_read_dicom_encapsulated_pdf(selenium):
    from pathlib import Path

    from itkwasm_dicom_emscripten import read_dicom_encapsulated_pdf_async

    test_file_path = '104.1-SR-printed-to-pdf.dcm'
    assert Path(test_file_path).exists()

    pdf_binary = await read_dicom_encapsulated_pdf_async(test_file_path)
    assert pdf_binary != None
    assert len(pdf_binary) == 91731