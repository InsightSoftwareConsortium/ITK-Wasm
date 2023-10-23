from pathlib import Path

from itkwasm_image_io_wasi import meta_read_image, meta_write_image

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / 'brainweb165a10f17.mha'
test_output_file_path = test_output_path / 'meta-image-test-brainweb165a10f17.mha'

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

def test_meta_read_image():
    could_read, image = meta_read_image(test_input_file_path)
    assert could_read
    verify_image(image)

def test_meta_write_image():
    could_read, image = meta_read_image(test_input_file_path)
    assert could_read

    use_compression = False
    could_write = meta_write_image(image, test_output_file_path, use_compression)
    assert could_write

    could_read, image = meta_read_image(test_output_file_path)
    assert could_read
    verify_image(image)