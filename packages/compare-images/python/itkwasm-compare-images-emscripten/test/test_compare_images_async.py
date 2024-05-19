import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide
from .fixtures import package_wheel, input_data

@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_compare_double_images_async(selenium, package_wheel, input_data):
    import micropip
    await micropip.install(package_wheel)
    await micropip.install('itkwasm-image-io-emscripten')
    def write_input_data_to_fs(input_data, filename):
        with open(filename, 'wb') as fp:
            fp.write(input_data[filename])

    import numpy as np
    from itkwasm import Image
    from itkwasm.pyodide import to_js as itkwasm_to_js
    from itkwasm_compare_images_emscripten import compare_double_images_async
    from itkwasm_image_io_emscripten import imread_async

    test_image_file = 'cake_easy.iwi.cbor'
    write_input_data_to_fs(input_data, test_image_file)
    test_image = await imread_async(test_image_file)

    baseline_image_file = 'cake_hard.iwi.cbor'
    write_input_data_to_fs(input_data, baseline_image_file)
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

@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_compare_images_async(selenium, package_wheel, input_data):
    import micropip
    await micropip.install(package_wheel)
    await micropip.install('itkwasm-image-io-emscripten')
    def write_input_data_to_fs(input_data, filename):
        with open(filename, 'wb') as fp:
            fp.write(input_data[filename])

    from itkwasm_compare_images_emscripten import compare_images_async
    from itkwasm_image_io_emscripten import imread_async
    import numpy as np
    from itkwasm import Image
    from itkwasm.pyodide import to_js as itkwasm_to_js

    test_image_file = 'cake_easy.iwi.cbor'
    write_input_data_to_fs(input_data, test_image_file)
    test_image = await imread_async(test_image_file)

    baseline_image_file = 'cake_hard.iwi.cbor'
    write_input_data_to_fs(input_data, baseline_image_file)
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
    write_input_data_to_fs(input_data, test_image_file)
    test_image = await imread_async(test_image_file)

    baseline_image_file = 'cake_hard.png'
    write_input_data_to_fs(input_data, baseline_image_file)
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
    write_input_data_to_fs(input_data, test_image_file)
    test_image = await imread_async(test_image_file)

    baseline_image_file = 'orange.jpg'
    write_input_data_to_fs(input_data, baseline_image_file)
    baseline_image = await imread_async(baseline_image_file)

    metrics, difference_image, difference_image_rendering = await compare_images_async(test_image, baseline_images=[baseline_image])

    assert metrics['almostEqual'] == False
    assert metrics['numberOfPixelsWithDifferences'] == 26477
    assert metrics['minimumDifference'] == 0.002273026683894841
    assert metrics['maximumDifference'] == 312.2511648746159
    assert metrics['totalDifference'] == 3121656.100202402
    assert metrics['meanDifference'] == 117.90067228924735

    assert difference_image.imageType.componentType == 'float64'
    assert difference_image_rendering.imageType.componentType == 'uint8'
