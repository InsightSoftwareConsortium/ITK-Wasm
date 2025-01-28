from itkwasm_image_io_wasi import gdcm_read_image

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / '1.3.6.1.4.1.5962.99.1.3814087073.479799962.1489872804257.100.0.dcm'
test_output_file_path = test_output_path / 'test_gdcm_read_image_1.3.6.1.4.1.5962.99.1.3814087073.479799962.1489872804257.100.0.dcm'

def verify_image(image):
    assert image.imageType.dimension == 3
    assert image.imageType.componentType == "int16"
    assert image.imageType.pixelType == "Scalar"
    assert image.imageType.components == 1
    assert image.size[0] == 256
    assert image.size[1] == 256
    assert image.size[2] == 1
    assert image.metadata['0008|1030'] == 'BRAIN '

def test_gdcm_read_image():
    could_read, image = gdcm_read_image(test_input_file_path)
    assert could_read
    verify_image(image)
