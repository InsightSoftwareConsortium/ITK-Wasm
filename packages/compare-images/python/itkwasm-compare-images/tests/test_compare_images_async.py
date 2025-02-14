import pytest
import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide
from pytest_pyodide.decorator import copy_files_to_pyodide
from .fixtures import input_file_list

file_list = input_file_list()

@copy_files_to_pyodide(file_list=file_list,install_wheels=True)
@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_compare_double_images_async(selenium):
    import micropip
    await micropip.install('itkwasm-image-io-emscripten')

    from itkwasm_compare_images import compare_double_images_async
    import numpy as np
    from itkwasm import Image
    from itkwasm.pyodide import to_js as itkwasm_to_js
    from itkwasm_image_io_emscripten import imread_async

    test_image_file = 'cake_easy.iwi.cbor'
    test_image = await imread_async(test_image_file)

    baseline_image_file = 'cake_hard.iwi.cbor'
    baseline_image = await imread_async(baseline_image_file)

    metrics, difference_image, difference_image_rendering = await compare_double_images_async(test_image, baseline_images=[baseline_image])

    assert metrics['almostEqual'] == False
    assert metrics['numberOfPixelsWithDifferences'] == 9915
    assert metrics['minimumDifference'] == 1.0
    assert metrics['maximumDifference'] == 107.0
    assert metrics['totalDifference'] == 337334.0
    assert metrics['meanDifference'] == 34.02259203227433

    assert difference_image.imageType.componentType == 'float64'
    assert difference_image_rendering.imageType.componentType == 'uint8'

@copy_files_to_pyodide(file_list=file_list,install_wheels=True)
@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_compare_images_async(selenium):
    import micropip
    await micropip.install('itkwasm-image-io-emscripten')

    from itkwasm_compare_images import compare_images_async
    import numpy as np
    from itkwasm import Image
    from itkwasm.pyodide import to_js as itkwasm_to_js
    from itkwasm_image_io_emscripten import imread_async

    test_image_file = 'cake_easy.iwi.cbor'
    test_image = await imread_async(test_image_file)

    baseline_image_file = 'cake_hard.iwi.cbor'
    baseline_image = await imread_async(baseline_image_file)

    metrics, difference_image, difference_image_rendering = await compare_images_async(test_image, baseline_images=[baseline_image])

    assert metrics['almostEqual'] == False
    assert metrics['numberOfPixelsWithDifferences'] == 9915
    assert metrics['minimumDifference'] == 1.0
    assert metrics['maximumDifference'] == 107.0
    assert metrics['totalDifference'] == 337334.0
    assert metrics['meanDifference'] == 34.02259203227433

    assert difference_image.imageType.componentType == 'float64'
    assert difference_image_rendering.imageType.componentType == 'uint8'

    test_image_file = 'cake_easy.png'
    test_image = await imread_async(test_image_file)

    baseline_image_file = 'cake_hard.png'
    baseline_image = await imread_async(baseline_image_file)

    metrics, difference_image, difference_image_rendering = await compare_images_async(test_image, baseline_images=[baseline_image])

    assert metrics['almostEqual'] == False
    assert metrics['numberOfPixelsWithDifferences'] == 9915
    assert metrics['minimumDifference'] == 1.0
    assert metrics['maximumDifference'] == 107.0
    assert metrics['totalDifference'] == 337334.0
    assert metrics['meanDifference'] == 34.02259203227433

    assert difference_image.imageType.componentType == 'float64'
    assert difference_image_rendering.imageType.componentType == 'uint8'

    test_image_file = 'apple.jpg'
    test_image = await imread_async(test_image_file)

    baseline_image_file = 'orange.jpg'
    baseline_image = await imread_async(baseline_image_file)

    metrics, difference_image, difference_image_rendering = await compare_images_async(test_image, baseline_images=[baseline_image])

    assert metrics['almostEqual'] == False
    assert metrics['numberOfPixelsWithDifferences'] == 26477
    assert metrics['minimumDifference'] == 0.002273026683894841
    assert metrics['maximumDifference'] == 312.2511648746159
    assert (abs(metrics['totalDifference'] - 3121703.1639738297) < 100)
    assert (abs(metrics['meanDifference'] - 117.90244982338746) < 1)

    assert difference_image.imageType.componentType == 'float64'
    assert difference_image_rendering.imageType.componentType == 'uint8'
