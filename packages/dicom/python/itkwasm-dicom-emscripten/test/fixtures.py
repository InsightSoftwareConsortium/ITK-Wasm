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
    input_base_path = Path('..', '..', 'test', 'data')
    test_files = [
        Path('input') / 'gsps-pstate-test-input-image.dcm',
        Path('input') / 'gsps-pstate-test-input-pstate.dcm',
        Path('baseline') / 'gsps-pstate-baseline.json',
        Path('baseline') / 'gsps-pstate-image-baseline.pgm',
        Path('input') / '104.1-SR-printed-to-pdf.dcm',
        Path('input') / '88.33-comprehensive-SR.dcm',
        Path('input') / '88.67-radiation-dose-SR.dcm',
        Path('input') / '88.59-KeyObjectSelection-SR.dcm',
        Path('input') / 'test-style.css',
    ]
    data = {}
    for f in test_files:
        with open(input_base_path / f, 'rb') as fp:
            print(str(f.name))
            data[str(f.name)] = fp.read()
    return data