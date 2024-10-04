from itkwasm import IntTypes, FloatTypes
import numpy as np

from itkwasm_mesh_io_wasi import read_point_set, pointsetread, write_point_set, pointsetwrite

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / "box-points.obj"
test_output_file_path = test_output_path / "read-write-box-points-python.obj"

def verify_point_set(point_set):
    assert point_set.pointSetType.dimension == 3
    assert point_set.pointSetType.pointComponentType == FloatTypes.Float32
    assert point_set.pointSetType.pointPixelComponentType == FloatTypes.Float32
    assert point_set.numberOfPoints == 8

def test_read_point_set():
    point_set = read_point_set(test_input_file_path)
    verify_point_set(point_set)

def test_point_setread():
    point_set = pointsetread(test_input_file_path)
    verify_point_set(point_set)

def test_write_point_set():
    point_set = read_point_set(test_input_file_path)

    use_compression = False
    write_point_set(point_set, test_output_file_path, use_compression=use_compression)

    point_set = read_point_set(test_output_file_path)
    verify_point_set(point_set)

def test_point_setwrite():
    point_set = pointsetread(test_input_file_path)

    use_compression = False
    pointsetwrite(point_set, test_output_file_path, use_compression=use_compression)

    point_set = pointsetread(test_output_file_path)
    verify_point_set(point_set)
