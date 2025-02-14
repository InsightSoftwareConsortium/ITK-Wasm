import pytest
import sys
from pathlib import Path
import shutil

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide

from itkwasm_compare_images import __version__ as test_package_version

def package_wheel():
    wheel_stem = f"itkwasm_compare_images-{test_package_version}-py3-none-any.whl"
    wheel_path = Path(__file__).parent.parent / 'dist' / 'pyodide' / wheel_stem
    return wheel_path, wheel_stem

def emscripten_package_wheel():
    wheel_stem = f"itkwasm_compare_images_emscripten-{test_package_version}-py3-none-any.whl"
    wheel_path = Path(__file__).parent.parent.parent / 'itkwasm-compare-images-emscripten' / 'dist' / 'pyodide' / wheel_stem
    # copy into this package's dist directory
    copied_wheel_path = Path(__file__).parent.parent / 'dist' / 'pyodide' / wheel_stem
    shutil.copyfile(wheel_path, copied_wheel_path)
    return copied_wheel_path, wheel_stem

def input_data():
    input_base_path = Path(__file__).parent.parent / 'tests' / 'data'
    test_files = [f for f in (input_base_path / 'input').rglob('*') if f.is_file()]
    # Must be unique.
    # test_files += [f for f in (input_base_path / 'baseline').rglob('*') if f.is_file()]
    return [(input_base_path / f, f.name) for f in test_files]

def input_file_list():
    return input_data() + [emscripten_package_wheel(), package_wheel()]