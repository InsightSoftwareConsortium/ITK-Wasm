from itkwasm_transform_io_wasi import wasm_read_transform, wasm_write_transform

from .common import test_input_path, test_output_path, verify_test_linear_transform

test_input_file_path = test_input_path / "LinearTransform.iwt.cbor"
test_output_file_path = test_output_path / "wasm-test-write-LinearTransform.iwt.cbor"

def test_wasm_write_transform():
    could_read, transform_list = wasm_read_transform(test_input_file_path)
    assert could_read
    could_write = wasm_write_transform(transform_list, test_output_file_path)
    assert could_write
    could_read, transform_list = wasm_read_transform(test_output_file_path)
    verify_test_linear_transform(transform_list)