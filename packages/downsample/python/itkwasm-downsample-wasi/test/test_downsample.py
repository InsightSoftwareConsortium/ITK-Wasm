from itkwasm_compare_images import compare_images
from itkwasm_image_io import read_image, write_image

from itkwasm_downsample_wasi import downsample
from itkwasm import PixelTypes

from .common import test_input_path, test_baseline_path, test_output_path

def test_downsample():
    test_input_file_path = test_input_path / 'cthead1.png'
    test_output_file_path = test_output_path / 'downsample-test-cthead1.mha'
    test_baseline_file_path = test_baseline_path / 'cthead1-downsample.nrrd'

    image = read_image(test_input_file_path)
    downsampled = downsample(image, shrink_factors=[2, 2])
    write_image(downsampled, test_output_file_path)

    baseline = read_image(test_baseline_file_path)
    metrics, _, _ = compare_images(downsampled, [baseline,])
    assert metrics['almostEqual']

def test_downsample_vector_image():
    test_input_file_path = test_input_path / 'apple.jpg'
    test_output_file_path = test_output_path / 'downsample-test-apple.mha'
    test_baseline_file_path = test_baseline_path / 'apple-downsample.mha'

    image = read_image(test_input_file_path)
    image.imageType.pixelType = PixelTypes.VariableLengthVector
    downsampled = downsample(image, shrink_factors=[2, 2])
    write_image(downsampled, test_output_file_path)

    baseline = read_image(test_baseline_file_path)
    metrics, _, _ = compare_images(downsampled, [baseline,])
    assert metrics['almostEqual']
