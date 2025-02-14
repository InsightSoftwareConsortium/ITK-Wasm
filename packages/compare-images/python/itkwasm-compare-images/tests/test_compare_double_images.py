import pytest
import sys
from pathlib import Path
import itk
from itkwasm import Image

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide
from pytest_pyodide.decorator import copy_files_to_pyodide
from .fixtures import input_file_list

file_list = input_file_list()

def test_compare_double_images():
    from itkwasm_compare_images_wasi import compare_double_images

    test_image_file = 'cake_easy.iwi.cbor'
    test_image_path = Path('..', '..', 'test', 'data', 'input', test_image_file)
    test_image = itk.imread(test_image_path)
    test_dict = itk.dict_from_image(test_image)
    test_image = Image(**test_dict)

    baseline_image_file = 'cake_hard.iwi.cbor'
    baseline_image_path = Path('..', '..', 'test', 'data', 'input', baseline_image_file)
    baseline_image = itk.imread(baseline_image_path)
    baseline_dict = itk.dict_from_image(baseline_image)
    baseline_image = Image(**baseline_dict)

    metrics, difference_image, difference_image_rendering = compare_double_images(test_image, baseline_images=[baseline_image])

    assert metrics['almostEqual'] == False
    assert metrics['numberOfPixelsWithDifferences'] == 9915
    assert metrics['minimumDifference'] == 1.0
    assert metrics['maximumDifference'] == 107.0
    assert metrics['totalDifference'] == 337334.0
    assert metrics['meanDifference'] == 34.02259203227433

    assert difference_image.imageType.componentType == 'float64'
    assert difference_image_rendering.imageType.componentType == 'uint8'