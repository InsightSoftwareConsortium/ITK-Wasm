from itkwasm_compare_images import compare_images
from itkwasm_image_io import read_image, write_image

from itkwasm_downsample_wasi import downsample_bin_shrink

from .common import test_input_path, test_baseline_path, test_output_path

def test_downsample_bin_shrink():
    test_input_file_path = test_input_path / 'cthead1.png'
    test_output_file_path = test_output_path / 'downsample-bin-shrink-test-cthead1.mha'
    test_baseline_file_path = test_baseline_path / 'cthead1-downsample-bin-shrink.nrrd'

    image = read_image(test_input_file_path)
    downsampled = downsample_bin_shrink(image, shrink_factors=[2, 2])
    write_image(downsampled, test_output_file_path)

    baseline = read_image(test_baseline_file_path)
    metrics, _, _ = compare_images(downsampled, [baseline,])
    assert metrics['almostEqual']
