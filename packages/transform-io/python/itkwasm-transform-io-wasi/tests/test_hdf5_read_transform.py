from pathlib import Path

from itkwasm_transform_io_wasi import hdf5_read_transform

from .common import test_input_path, test_output_path, verify_test_linear_transform

test_input_file_path = test_input_path / "LinearTransform.h5"
test_output_file_path = test_output_path / "hdf5-test-write-LinearTransform.h5"

def test_hdf5_read_transform():
    could_read, transform_list = hdf5_read_transform(test_input_file_path)
    assert could_read
    verify_test_linear_transform(transform_list)
