from pathlib import Path
import itk
from itkwasm import Image

def test_compare_double_images():
    from itkwasm_compare_images import compare_images

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

    metrics, difference_image, difference_image_rendering = compare_images(test_image, baseline_images=[baseline_image])

    assert metrics['almostEqual'] == False
    assert metrics['numberOfPixelsWithDifferences'] == 9915
    assert metrics['minimumDifference'] == 1.0
    assert metrics['maximumDifference'] == 107.0
    assert metrics['totalDifference'] == 337334.0
    assert metrics['meanDifference'] == 34.02259203227433

    assert difference_image.imageType.componentType == 'float64'
    assert difference_image_rendering.imageType.componentType == 'uint8'

def test_compare_uint8_images():
    from itkwasm_compare_images import compare_images

    test_image_file = 'cake_easy.png'
    test_image_path = Path('..', '..', 'test', 'data', 'input', test_image_file)
    test_image = itk.imread(test_image_path)
    test_dict = itk.dict_from_image(test_image)
    test_image = Image(**test_dict)

    baseline_image_file = 'cake_hard.png'
    baseline_image_path = Path('..', '..', 'test', 'data', 'input', baseline_image_file)
    baseline_image = itk.imread(baseline_image_path)
    baseline_dict = itk.dict_from_image(baseline_image)
    baseline_image = Image(**baseline_dict)

    metrics, difference_image, difference_image_rendering = compare_images(test_image, baseline_images=[baseline_image])

    assert metrics['almostEqual'] == False
    assert metrics['numberOfPixelsWithDifferences'] == 9915
    assert metrics['minimumDifference'] == 1.0
    assert metrics['maximumDifference'] == 107.0
    assert metrics['totalDifference'] == 337334.0
    assert metrics['meanDifference'] == 34.02259203227433

    assert difference_image.imageType.componentType == 'float64'
    assert difference_image_rendering.imageType.componentType == 'uint8'

def test_compare_rgb_images():
    from itkwasm_compare_images import compare_images

    test_image_file = 'apple.jpg'
    test_image_path = Path('..', '..', 'test', 'data', 'input', test_image_file)
    test_image = itk.imread(test_image_path)
    test_dict = itk.dict_from_image(test_image)
    test_image = Image(**test_dict)

    baseline_image_file = 'orange.jpg'
    baseline_image_path = Path('..', '..', 'test', 'data', 'input', baseline_image_file)
    baseline_image = itk.imread(baseline_image_path)
    baseline_dict = itk.dict_from_image(baseline_image)
    baseline_image = Image(**baseline_dict)

    metrics, difference_image, difference_image_rendering = compare_images(test_image, baseline_images=[baseline_image])

    assert metrics['almostEqual'] == False
    assert metrics['numberOfPixelsWithDifferences'] == 26477
    assert metrics['minimumDifference'] == 0.002273026683894841
    assert metrics['maximumDifference'] == 312.2511648746159
    assert metrics['totalDifference'] == 3121656.100202402
    assert metrics['meanDifference'] == 117.90067228924735

    assert difference_image.imageType.componentType == 'float64'
    assert difference_image_rendering.imageType.componentType == 'uint8'
