from pathlib import Path

from itkwasm import FloatTypes, IntTypes, PixelTypes

from itkwasm_mesh_io_wasi import byu_read_mesh, byu_write_mesh

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / "cube.byu"
test_output_file_path = test_output_path / "byu-test-cube.byu"

def verify_mesh(mesh):
    assert mesh.meshType.dimension == 3
    assert mesh.meshType.pointComponentType == FloatTypes.Float64
    assert mesh.meshType.cellComponentType == IntTypes.UInt32
    assert mesh.meshType.pointPixelType == PixelTypes.Scalar
    assert mesh.meshType.cellPixelType == PixelTypes.Scalar
    assert mesh.numberOfPoints == 8
    assert mesh.numberOfCells == 6

def test_byu_read_mesh():
    could_read, mesh = byu_read_mesh(test_input_file_path)
    assert could_read
    verify_mesh(mesh)

def test_byu_write_mesh():
    could_read, mesh = byu_read_mesh(test_input_file_path)
    assert could_read

    use_compression = False
    could_write = byu_write_mesh(mesh, test_output_file_path, use_compression=use_compression)
    assert could_write

    could_read, mesh = byu_read_mesh(test_output_file_path)
    assert could_read
    verify_mesh(mesh)