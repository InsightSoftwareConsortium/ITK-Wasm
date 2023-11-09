import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide
from .fixtures import package_wheel, input_data

@run_in_pyodide(packages=['micropip'])
async def test_read_write_image_async(selenium, package_wheel, input_data):
    import micropip
    await micropip.install(package_wheel)
    def write_input_data_to_fs(input_data, filename):
        with open(filename, 'wb') as fp:
            fp.write(input_data[filename])

    from pathlib import Path

    from itkwasm_image_io_emscripten import read_image_async, write_image_async

    test_input_file_path = "cthead1.png"
    test_output_file_path = "read-write-cthead1.png"

    def verify_image(image):
        assert image.imageType.dimension == 2
        assert image.imageType.componentType == "uint8"
        assert image.imageType.pixelType == "RGB"
        assert image.imageType.components == 3
        assert image.origin[0] == 0.0
        assert image.origin[1] == 0.0
        assert image.spacing[0] == 1.0
        assert image.spacing[1] == 1.0
        assert image.direction[0, 0] == 1.0
        assert image.direction[0, 1] == 0.0
        assert image.direction[1, 0] == 0.0
        assert image.direction[1, 1] == 1.0
        assert image.size[0] == 256
        assert image.size[1] == 256
        assert image.data.shape[1] == 256
        assert image.data.shape[0] == 256

    write_input_data_to_fs(input_data, test_input_file_path)

    assert Path(test_input_file_path).exists()

    image = await read_image_async(test_input_file_path)
    verify_image(image)

    use_compression = False
    await write_image_async(image, test_output_file_path, use_compression=use_compression)

    image = await read_image_async(test_output_file_path)
    verify_image(image)