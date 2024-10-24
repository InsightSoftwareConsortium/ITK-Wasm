import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

import pytest
from pytest_pyodide import run_in_pyodide
from .fixtures import emscripten_package_wheel, package_wheel, input_data

@pytest.mark.driver_timeout(30)
@run_in_pyodide(packages=['micropip'])
async def test_bio_rad_async(selenium, emscripten_package_wheel, package_wheel, input_data):
    import micropip
    await micropip.install(emscripten_package_wheel)
    await micropip.install(package_wheel)
    def write_input_data_to_fs(input_data, filename):
        with open(filename, 'wb') as fp:
            fp.write(input_data[filename])

    from pathlib import Path

    from itkwasm_image_io import bio_rad_read_image_async, bio_rad_write_image_async

    def verify_image(image):
        assert image.imageType.dimension == 2
        assert image.imageType.componentType == "uint8"
        assert image.imageType.pixelType == "Scalar"
        assert image.imageType.components == 1
        assert image.origin[0] == 0.0
        assert image.origin[1] == 0.0
        assert image.spacing[0] == 0.06000000238418579
        assert image.spacing[1] == 0.06000000238418579
        assert image.direction[0, 0] == 1.0
        assert image.direction[0, 1] == 0.0
        assert image.direction[1, 0] == 0.0
        assert image.direction[1, 1] == 1.0
        assert image.size[0] == 768
        assert image.size[1] == 512
        assert image.data.shape[1] == 768
        assert image.data.shape[0] == 512
        assert image.data.ravel()[1000] == 27

    test_file_path = 'biorad.pic'
    write_input_data_to_fs(input_data, test_file_path)

    assert Path(test_file_path).exists()

    could_read, image = await bio_rad_read_image_async(test_file_path)
    assert could_read
    verify_image(image)

    test_output_file_path = 'biorad_out.pic'

    use_compression = False
    could_write = await bio_rad_write_image_async(image, test_output_file_path, use_compression)
    assert could_write

    could_read, image = await bio_rad_read_image_async(test_output_file_path)
    assert could_read
    verify_image(image)