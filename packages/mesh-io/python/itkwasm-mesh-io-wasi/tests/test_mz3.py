from pathlib import Path

from itkwasm import FloatTypes, IntTypes, PixelTypes

from itkwasm_mesh_io_wasi import mz3_read_mesh, mz3_write_mesh

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / "11ScalarMesh.mz3"
test_output_file_path = test_output_path / "mz3-test-11ScalarMesh.mz3"

def verify_mesh(mesh):
    assert mesh.meshType.dimension == 3
    assert mesh.meshType.pointComponentType == FloatTypes.Float32
    assert mesh.meshType.cellComponentType == IntTypes.UInt32
    assert mesh.meshType.pointPixelType == PixelTypes.Scalar
    assert mesh.meshType.cellPixelType == PixelTypes.Scalar
    assert mesh.numberOfPoints == 6
    assert mesh.numberOfCells == 8

def test_mz3_read_mesh():
    could_read, mesh = mz3_read_mesh(test_input_file_path)
    assert could_read
    verify_mesh(mesh)

def test_mz3_write_mesh():
    could_read, mesh = mz3_read_mesh(test_input_file_path)
    assert could_read

    use_compression = False
    could_write = mz3_write_mesh(mesh, test_output_file_path, use_compression=use_compression)
    assert could_write

    could_read, mesh = mz3_read_mesh(test_output_file_path)
    assert could_read
    verify_mesh(mesh)