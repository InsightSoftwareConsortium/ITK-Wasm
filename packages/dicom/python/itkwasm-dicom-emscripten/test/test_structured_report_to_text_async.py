import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)


from pytest_pyodide import run_in_pyodide
from .fixtures import package_wheel, input_data

@run_in_pyodide(packages=['micropip'])
async def test_structured_report_to_text(selenium, package_wheel, input_data):
    import micropip
    await micropip.install(package_wheel)
    def write_input_data_to_fs(input_data, filename):
        with open(filename, 'wb') as fp:
            fp.write(input_data[filename])

    from pathlib import Path

    from itkwasm_dicom_emscripten import structured_report_to_text_async

    test_file_path = '88.33-comprehensive-SR.dcm'
    write_input_data_to_fs(input_data, test_file_path)

    assert Path(test_file_path).exists()

    output_text = await structured_report_to_text_async(test_file_path)
    assert output_text.find('Comprehensive SR Document') != -1
    assert output_text.find('Pathology') != -1

    output_text = await structured_report_to_text_async(test_file_path, no_document_header=True)
    assert output_text.find('Comprehensive SR Document') == -1
    assert output_text.find('Breast Imaging Report') != -1
    assert output_text.find('Pathology') != -1