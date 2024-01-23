import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide
from .fixtures import package_wheel, input_data

@run_in_pyodide(packages=['micropip'])
async def test_downsample_async(selenium, package_wheel, input_data):
    import micropip
    await micropip.install([package_wheel, 'itkwasm-image-io', 'itkwasm-compare-images'])
    def write_input_data_to_fs(input_data, filename):
        with open(filename, 'wb') as fp:
            fp.write(input_data[filename])

    from pathlib import Path

    from itkwasm_image_io import read_image_async
    from itkwasm_compare_images import compare_images_async

    from itkwasm_downsample_emscripten import downsample_async

    test_input_file_path = 'cthead1.png'
    test_baseline_file_path = 'cthead1-downsample.nrrd'

    write_input_data_to_fs(input_data, test_input_file_path)
    write_input_data_to_fs(input_data, test_baseline_file_path)

    assert Path(test_input_file_path).exists()

    image = await read_image_async(test_input_file_path)

    downsampled = await downsample_async(image, shrink_factors=[2, 2])

    baseline = await read_image_async(test_baseline_file_path)
    metrics, _, _ = await compare_images_async(downsampled, baseline_images=[baseline,])
    assert metrics['almostEqual']