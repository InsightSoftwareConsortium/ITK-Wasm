from itkwasm_transform_io_wasi import wasm_read_transform

from .common import test_input_path, verify_test_linear_transform

test_input_file_path = test_input_path / "LinearTransform.iwt.cbor"

def test_wasm_read_transform():
    could_read, transform_list = wasm_read_transform(test_input_file_path)
    assert could_read
    verify_test_linear_transform(transform_list)