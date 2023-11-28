from pathlib import Path

from itkwasm import FloatTypes, IntTypes, PixelTypes

from itkwasm_mesh_io_wasi import stl_read_mesh, stl_write_mesh

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / "sphere.stl"
test_output_file_path = test_output_path / "stl-test-sphere.stl"

def verify_mesh(mesh):
    assert mesh.meshType.dimension == 3
    assert mesh.meshType.pointComponentType == FloatTypes.Float32
    assert mesh.meshType.cellComponentType == IntTypes.UInt32
    assert mesh.meshType.pointPixelType == PixelTypes.Scalar
    assert mesh.meshType.cellPixelType == PixelTypes.Scalar
    assert mesh.numberOfPoints == 18
    assert mesh.numberOfCells == 32

def test_stl_read_mesh():
    could_read, mesh = stl_read_mesh(test_input_file_path)
    assert could_read
    verify_mesh(mesh)

def test_stl_write_mesh():
    could_read, mesh = stl_read_mesh(test_input_file_path)
    assert could_read

    use_compression = False
    could_write = stl_write_mesh(mesh, test_output_file_path, use_compression=use_compression)
    assert could_write

    could_read, mesh = stl_read_mesh(test_output_file_path)
    assert could_read
    verify_mesh(mesh)