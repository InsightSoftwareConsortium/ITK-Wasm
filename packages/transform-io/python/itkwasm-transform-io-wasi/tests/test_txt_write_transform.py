from itkwasm_transform_io_wasi import txt_read_transform, txt_write_transform

from .common import test_input_path, test_output_path, verify_test_linear_transform

test_input_file_path = test_input_path / "LinearTransform.txt"
test_output_file_path = test_output_path / "txt-test-write-LinearTransform.txt"

def test_txt_write_transform():
    could_read, transform_list = txt_read_transform(test_input_file_path)
    assert could_read
    could_write = txt_write_transform(transform_list, test_output_file_path)
    assert could_write
    could_read, transform_list = txt_read_transform(test_output_file_path)
    verify_test_linear_transform(transform_list)