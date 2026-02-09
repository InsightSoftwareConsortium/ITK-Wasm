import numpy as np

from itkwasm_image_io_wasi import (
    wasm_zstd_read_image,
    wasm_zstd_write_image,
    wasm_read_image,
)

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / "cthead1.iwi.cbor"
test_output_file_path = test_output_path / "wasm-zstd-write-test-cthead1.iwi.cbor.zst"


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
    assert image.size[0] == 256
    assert image.size[1] == 256
    assert image.data.shape[0] == 256
    assert image.data.shape[1] == 256
    assert image.data.dtype == np.uint8
    assert image.data.size == 196608


def test_wasm_zstd_write_image():
    """Test writing a zstd-compressed IWI CBOR file and reading it back."""
    # Read the source image
    could_read, image = wasm_read_image(test_input_file_path)
    assert could_read

    # Write as zstd-compressed IWI CBOR
    could_write = wasm_zstd_write_image(image, str(test_output_file_path))
    assert could_write

    # Read back with zstd reader
    could_read_back, image_back = wasm_zstd_read_image(test_output_file_path)
    assert could_read_back
    verify_image(image_back)

    # Verify pixel data is identical after round-trip
    np.testing.assert_array_equal(image.data, image_back.data)
