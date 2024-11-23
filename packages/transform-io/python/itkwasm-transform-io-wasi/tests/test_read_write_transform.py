from itkwasm import IntTypes, FloatTypes
import numpy as np

from itkwasm_transform_io_wasi import read_transform, transformread, write_transform, transformwrite

from .common import test_input_path, test_output_path, verify_test_linear_transform
verify_transform = verify_test_linear_transform

test_input_file_path = test_input_path / "LinearTransform.h5"
test_output_file_path = test_output_path / "read-write-LinearTransform.h5"

def test_read_transform():
    transform = read_transform(test_input_file_path)
    verify_transform(transform)

def test_transformread():
    transform = transformread(test_input_file_path)
    verify_transform(transform)

def test_write_transform():
    transform = read_transform(test_input_file_path)

    use_compression = False
    write_transform(transform, test_output_file_path, use_compression=use_compression)

    transform = read_transform(test_output_file_path)
    verify_transform(transform)

def test_transformwrite():
    transform = transformread(test_input_file_path)

    use_compression = False
    transformwrite(transform, test_output_file_path, use_compression=use_compression)

    transform = transformread(test_output_file_path)
    verify_transform(transform)
