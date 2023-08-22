import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide
from .fixtures import package_wheel, input_data

@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_compare_double_images_async(selenium, package_wheel, input_data):
    import micropip
    await micropip.install(package_wheel, 'numpy', 'itkwasm')

    from itkwasm_compare_images import compare_double_images_async
    import numpy as np
    from itkwasm import Image
    from itkwasm.pyodide import to_js as itkwasm_to_js

    test_image_file = 'cake_easy.iwi.cbor'
    test_image = Image(**input_data[test_image_file])

    baseline_image_file = 'cake_hard.iwi.cbor'
    baseline_image = Image(**input_data[baseline_image_file])

    metrics, difference_image, difference_image_rendering = await compare_double_images_async(test_image, baseline_images=[baseline_image])

    assert metrics['almostEqual'] == False
    assert metrics['numberOfPixelsWithDifferences'] == 9915
    assert metrics['minimumDifference'] == 1.0
    assert metrics['maximumDifference'] == 107.0
    assert metrics['totalDifference'] == 337334.0
    assert metrics['meanDifference'] == 34.02259203227433

    assert difference_image.imageType.componentType == 'float64'
    assert difference_image_rendering.imageType.componentType == 'uint8'

@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_compare_images_async(selenium, package_wheel, input_data):
    import micropip
    await micropip.install(package_wheel, 'numpy', 'itkwasm')

    from itkwasm_compare_images import compare_images_async
    import numpy as np
    from itkwasm import Image
    from itkwasm.pyodide import to_js as itkwasm_to_js

    test_image_file = 'cake_easy.iwi.cbor'
    test_image = Image(**input_data[test_image_file])

    baseline_image_file = 'cake_hard.iwi.cbor'
    baseline_image = Image(**input_data[baseline_image_file])

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
    test_image = Image(**input_data[test_image_file])

    baseline_image_file = 'cake_hard.png'
    baseline_image = Image(**input_data[baseline_image_file])

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
    test_image = Image(**input_data[test_image_file])

    baseline_image_file = 'orange.jpg'
    baseline_image = Image(**input_data[baseline_image_file])

    metrics, difference_image, difference_image_rendering = await compare_images_async(test_image, baseline_images=[baseline_image])

    assert metrics['almostEqual'] == False
    assert metrics['numberOfPixelsWithDifferences'] == 26477
    assert metrics['minimumDifference'] == 0.002273026683894841
    assert metrics['maximumDifference'] == 312.2511648746159
    assert metrics['totalDifference'] == 3121656.100202402
    assert metrics['meanDifference'] == 117.90067228924735

    assert difference_image.imageType.componentType == 'float64'
    assert difference_image_rendering.imageType.componentType == 'uint8'
