from itkwasm_compare_images import compare_images
from itkwasm_image_io import read_image, write_image

from itkwasm_downsample_wasi import downsample_label_image

from .common import test_input_path, test_baseline_path, test_output_path

def test_downsample_label_image():
    test_input_file_path = test_input_path / '2th_cthead1.png'
    test_output_file_path = test_output_path / 'downsample-label-image-test-2th_cthead1.mha'
    test_baseline_file_path = test_baseline_path / '2th_cthead1-downsample-label-image.nrrd'

    image = read_image(test_input_file_path)
    downsampled = downsample_label_image(image, shrink_factors=[2, 2])
    write_image(downsampled, test_output_file_path)

    baseline = read_image(test_baseline_file_path)
    metrics, _, _ = compare_images(downsampled, [baseline,])
    assert metrics['almostEqual']
