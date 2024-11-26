from itkwasm_transform_io import hdf5_read_transform, hdf5_write_transform

from .common import test_input_path, test_output_path, verify_test_linear_transform

test_input_file_path = test_input_path / "LinearTransform.h5"
test_output_file_path = test_output_path / "hdf5-test-write-LinearTransform.h5"

def test_hdf5_write_transform():
    could_read, transform_list = hdf5_read_transform(test_input_file_path)
    assert could_read
    could_write = hdf5_write_transform(transform_list, test_output_file_path)
    assert could_write
    could_read, transform_list = hdf5_read_transform(test_output_file_path)
    verify_test_linear_transform(transform_list)
