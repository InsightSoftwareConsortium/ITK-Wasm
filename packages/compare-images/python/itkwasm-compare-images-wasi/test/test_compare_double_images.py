from pathlib import Path
import itk
from itkwasm import Image

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
