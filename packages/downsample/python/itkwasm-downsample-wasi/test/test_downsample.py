import pytest

from itkwasm_compare_images import compare_images
from itkwasm_image_io import read_image, write_image

from itkwasm_downsample_wasi import downsample, downsample_bin_shrink
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

    # Downsampling shifts the origin to the coarse-grid pixel centers
    assert downsampled.origin == pytest.approx([0.5, 0.5], abs=1e-6)
    assert downsampled.spacing == [2, 2]
    assert downsampled.size == [128, 128]

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

    # Origin shifts by half of the input spacing along each axis (shrink factor 2)
    expected_origin = [origin + 0.5 * spacing for origin, spacing in zip(image.origin, image.spacing)]
    assert downsampled.origin == pytest.approx(expected_origin, abs=1e-6)

def test_downsample_origin_matches_bin_shrink():
    test_input_file_path = test_input_path / 'cthead1.png'

    image = read_image(test_input_file_path)
    downsampled = downsample(image, shrink_factors=[2, 2])
    bin_shrunk = downsample_bin_shrink(image, shrink_factors=[2, 2])

    # Pin the itk::BinShrinkImageFilter grid convention, https://github.com/InsightSoftwareConsortium/ITK-Wasm/issues/1409
    assert downsampled.origin == bin_shrunk.origin
    assert downsampled.spacing == bin_shrunk.spacing
    assert downsampled.size == bin_shrunk.size

def test_downsample_crop_radius_origin():
    test_input_file_path = test_input_path / 'cthead1.png'

    image = read_image(test_input_file_path)
    downsampled = downsample(image, shrink_factors=[2, 2], crop_radius=[8, 8])

    assert downsampled.origin == pytest.approx([8.5, 8.5], abs=1e-6)
    assert downsampled.spacing == [2, 2]
    assert downsampled.size == [120, 120]
