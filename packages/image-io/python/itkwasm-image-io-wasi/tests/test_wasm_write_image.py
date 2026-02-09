import numpy as np

from itkwasm_image_io_wasi import wasm_read_image, wasm_write_image

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / "cthead1.iwi.cbor"
test_output_file_path = test_output_path / "wasm-write-test-cthead1.iwi.cbor"


def verify_image(image):
    """Verify metadata and pixel data for cthead1 (uint8 RGB, 256x256)."""
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
    assert image.data.shape[0] == 256
    assert image.data.shape[1] == 256
    assert image.data.dtype == np.uint8
    assert image.data.size == 196608


def test_wasm_write_image():
    """Test writing an IWI CBOR file and reading it back (uint8 RGB round-trip)."""
    could_read, image = wasm_read_image(test_input_file_path)
    assert could_read

    could_write = wasm_write_image(image, str(test_output_file_path))
    assert could_write

    could_read_back, image_back = wasm_read_image(test_output_file_path)
    assert could_read_back
    verify_image(image_back)

    # Verify pixel data is identical after round-trip
    np.testing.assert_array_equal(image.data, image_back.data)


def test_wasm_write_image_from_png():
    """Test writing an IWI CBOR from a PNG-sourced image (uint8 cross-format)."""
    from itkwasm_image_io_wasi import png_read_image

    test_png_path = test_input_path / "cthead1.png"
    could_read, image = png_read_image(test_png_path)
    assert could_read
    assert image.imageType.componentType == "uint8"

    output_cbor_path = test_output_path / "wasm-write-test-from-png.iwi.cbor"
    could_write = wasm_write_image(image, str(output_cbor_path))
    assert could_write

    could_read_back, image_back = wasm_read_image(output_cbor_path)
    assert could_read_back
    assert image_back.imageType.componentType == "uint8"
    assert image_back.data.dtype == np.uint8
    np.testing.assert_array_equal(image.data, image_back.data)
