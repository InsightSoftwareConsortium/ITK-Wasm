from pathlib import Path

from itkwasm import FloatTypes, PixelTypes

from itkwasm_mesh_io_wasi import obj_read_point_set, obj_write_point_set

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / "box-points.obj"
test_output_file_path = test_output_path / "obj-point-set-test-box-python.obj"

def verify_point_set(point_set):
    assert point_set.pointSetType.dimension == 3
    assert point_set.pointSetType.pointComponentType == FloatTypes.Float32
    assert point_set.pointSetType.pointPixelType == PixelTypes.Vector
    assert point_set.numberOfPoints == 8

def test_obj_read_point_set():
    could_read, point_set = obj_read_point_set(test_input_file_path)
    assert could_read
    verify_point_set(point_set)

def test_obj_write_point_set():
    could_read, point_set = obj_read_point_set(test_input_file_path)
    assert could_read

    use_compression = False
    could_write = obj_write_point_set(point_set, test_output_file_path, use_compression=use_compression)
    assert could_write

    could_read, point_set = obj_read_point_set(test_output_file_path)
    assert could_read
    verify_point_set(point_set)