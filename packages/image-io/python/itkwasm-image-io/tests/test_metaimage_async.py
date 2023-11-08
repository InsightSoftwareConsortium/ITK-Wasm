import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide
from .fixtures import package_wheel, input_data

@run_in_pyodide(packages=['micropip'])
async def test_metaimage_async(selenium, package_wheel, input_data):
    import micropip
    await micropip.install(package_wheel)
    def write_input_data_to_fs(input_data, filename):
        with open(filename, 'wb') as fp:
            fp.write(input_data[filename])

    from pathlib import Path

    from itkwasm_image_io_emscripten import meta_read_image_async, meta_write_image_async

    test_input_file_path = 'brainweb165a10f17.mha'
    test_output_file_path = 'meta-image-test-brainweb165a10f17.mha'

    def verify_image(image):
        assert image.imageType.dimension == 3
        assert image.imageType.componentType == "uint8"
        assert image.imageType.pixelType == "Scalar"
        assert image.imageType.components == 1
        assert image.origin[0] == 0.0
        assert image.origin[1] == 0.0
        assert image.origin[2] == 0.0
        assert image.spacing[0] == 1.0
        assert image.spacing[1] == 1.0
        assert image.spacing[2] == 1.0
        assert image.direction[0, 0] == 1.0
        assert image.direction[0, 1] == 0.0
        assert image.direction[0, 2] == 0.0
        assert image.direction[1, 0] == 0.0
        assert image.direction[1, 1] == 1.0
        assert image.direction[1, 2] == 0.0
        assert image.direction[2, 0] == 0.0
        assert image.direction[2, 1] == 0.0
        assert image.direction[2, 2] == 1.0
        assert image.size[0] == 181
        assert image.size[1] == 217
        assert image.size[2] == 180
        assert image.data.ravel()[0] == 5
        assert image.data.ravel()[1] == 8
        assert image.data.ravel()[2] == 2

    write_input_data_to_fs(input_data, test_input_file_path)

    assert Path(test_input_file_path).exists()

    could_read, image = await meta_read_image_async(test_input_file_path)
    assert could_read
    verify_image(image)

    use_compression = False
    could_write = await meta_write_image_async(image, test_output_file_path, use_compression)
    assert could_write

    could_read, image = await meta_read_image_async(test_output_file_path)
    assert could_read
    verify_image(image)