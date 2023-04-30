import pytest
import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide

from itkwasm_dicom_emscripten import __version__ as test_package_version

@pytest.fixture
def package_wheel():
    return f"itkwasm_dicom_emscripten-{test_package_version}-py3-none-any.whl"

@pytest.fixture
def input_data():
    from pathlib import Path
    input_base_path = Path('..', '..', '..', '..', 'build-emscripten', 'ExternalData', 'test', 'Input')
    test_files = [
        'gsps-pstate-test-input-image.dcm',
        'gsps-pstate-test-input-pstate.dcm',
        'gsps-pstate-baseline.json',
        'gsps-pstate-image-baseline.pgm',
        '104.1-SR-printed-to-pdf.dcm',
        '88.33-comprehensive-SR.dcm',
        '88.67-radiation-dose-SR.dcm',
        '88.59-KeyObjectSelection-SR.dcm',
        'test-style.css',
    ]
    data = {}
    for f in test_files:
        with open(input_base_path / f, 'rb') as fp:
            data[f] = fp.read()
    return data