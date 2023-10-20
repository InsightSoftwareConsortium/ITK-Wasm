from pathlib import Path

from itkwasm import PixelTypes, IntTypes

from itkwasm_image_io_wasi import read_image, imread

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / "cthead1.png"
test_output_file_path = test_output_path / "read-write-cthead1.png"

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

def test_read_image():
    image = read_image(test_input_file_path)
    verify_image(image)

def test_read_image_pixel_type():
    image = read_image(test_input_file_path, pixel_type=PixelTypes.Vector)
    assert image.imageType.pixelType == "Vector"

def test_read_image_component_type():
    image = read_image(test_input_file_path, component_type=IntTypes.UInt16)
    assert image.imageType.componentType == "uint16"

def test_imread():
    image = imread(test_input_file_path)
    verify_image(image)

def test_write_image():
    pass
    return
    could_read, image = png_read_image(test_input_file_path)
    assert could_read

    use_compression = False
    could_write = png_write_image(image, test_output_file_path, use_compression)
    assert could_write

    could_read, image = png_read_image(test_output_file_path)
    assert could_read
    verify_image(image)
