from itkwasm_compare_images import compare_images
from itkwasm_image_io import read_image, write_image

from itkwasm_downsample_cucim import downsample

from .common import test_input_path, test_baseline_path, test_output_path

def test_downsample():
    test_input_file_path = test_input_path / 'cthead1.png'
    test_output_file_path = test_output_path / 'downsample-test-cthead1-cucim.mha'
    test_baseline_file_path = test_baseline_path / 'cthead1-downsample.nrrd'

    image = read_image(test_input_file_path)
    downsampled = downsample(image, shrink_factors=[2, 2])
    write_image(downsampled, test_output_file_path)

    baseline = read_image(test_baseline_file_path)
    metrics, diff_image, diff_image_uchar = compare_images(downsampled, [baseline,], difference_threshold=1.0)
    write_image(diff_image, test_output_path / 'downsample-cthead1-cucim-diff.mha')
    write_image(diff_image_uchar, test_output_path / 'downsample-test-cthead1-cucim-diff-uchar.png')
    assert metrics['almostEqual']
