import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide
from .fixtures import package_wheel, input_data

@run_in_pyodide(packages=['micropip'])
async def test_read_dicom_encapsulated_pdf(selenium, package_wheel, input_data):
    import micropip
    await micropip.install(package_wheel)
    def write_input_data_to_fs(input_data, filename):
        with open(filename, 'wb') as fp:
            fp.write(input_data[filename])

    from pathlib import Path

    from itkwasm_dicom_emscripten import read_dicom_encapsulated_pdf_async

    test_file_path = '104.1-SR-printed-to-pdf.dcm'
    write_input_data_to_fs(input_data, test_file_path)

    assert Path(test_file_path).exists()

    pdf_binary = await read_dicom_encapsulated_pdf_async(test_file_path)
    assert pdf_binary != None
    assert len(pdf_binary) == 91731