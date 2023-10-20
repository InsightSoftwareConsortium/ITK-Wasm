from pathlib import Path

from itkwasm_image_io_wasi import bio_rad_read_image, bio_rad_write_image

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / "biorad.pic"
test_output_file_path = test_output_path / "biorad.pic"

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

def test_bio_rad_read_image():
    could_read, image = bio_rad_read_image(test_input_file_path)
    assert could_read
    verify_image(image)

def test_bio_rad_write_image():
    could_read, image = bio_rad_read_image(test_input_file_path)
    assert could_read

    use_compression = False
    could_write = bio_rad_write_image(image, test_output_file_path, use_compression)
    assert could_write

    could_read, image = bio_rad_read_image(test_output_file_path)
    assert could_read
    verify_image(image)