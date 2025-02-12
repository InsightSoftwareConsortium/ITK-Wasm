import sys
from pathlib import Path

import pytest

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from itkwasm_dicom_emscripten import __version__ as test_package_version

def package_wheel():
    wheel_stem = f"itkwasm_dicom_emscripten-{test_package_version}-py3-none-any.whl"
    wheel_path = Path(__file__).parent.parent / 'dist' / 'pyodide' / wheel_stem
    return wheel_path, wheel_stem

def input_data():
    input_base_path = Path(__file__).parent.parent / 'tests' / 'data'
    # test_files = [f for f in (input_base_path / 'input').rglob('*') if f.is_file()]
    # test_files += [f for f in (input_base_path / 'baseline').rglob('*') if f.is_file()]
    test_files = [
        Path('input') / 'csps-input-image.dcm',
        Path('input') / 'csps-input-pstate.dcm',
        Path('input') / 'gsps-pstate-test-input-image.dcm',
        Path('input') / 'gsps-pstate-test-input-pstate.dcm',
        Path('baseline') / 'csps-pstate-baseline.json',
        Path('baseline') / 'csps-output-image-baseline.bmp',
        Path('baseline') / 'gsps-pstate-baseline.json',
        Path('baseline') / 'gsps-pstate-image-baseline.pgm',
        Path('input') / '104.1-SR-printed-to-pdf.dcm',
        Path('input') / '88.33-comprehensive-SR.dcm',
        Path('input') / '88.67-radiation-dose-SR.dcm',
        Path('input') / '88.59-KeyObjectSelection-SR.dcm',
        Path('input') / 'test-style.css',
    ]
    return [(input_base_path / f, f.name) for f in test_files]

def input_file_list():
    return input_data() + [package_wheel()]