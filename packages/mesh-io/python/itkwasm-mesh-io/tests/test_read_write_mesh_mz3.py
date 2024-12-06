from itkwasm import IntTypes, PixelTypes, FloatTypes
import numpy as np

from itkwasm_mesh_io import read_mesh, meshread, write_mesh, meshwrite

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / "11ScalarMesh.mz3"
test_output_file_path = test_output_path / "read-write-11ScalarMesh.mz3"

def verify_mesh(mesh):
    assert mesh.meshType.dimension == 3
    assert mesh.meshType.pointComponentType == FloatTypes.Float32
    assert mesh.meshType.cellComponentType == IntTypes.UInt32
    assert mesh.meshType.pointPixelType == PixelTypes.Scalar
    assert mesh.meshType.cellPixelType == PixelTypes.Scalar
    assert mesh.numberOfPoints == 6
    assert mesh.numberOfCells == 8

def test_read_mesh():
    mesh = read_mesh(test_input_file_path)
    verify_mesh(mesh)

def test_meshread():
    mesh = meshread(test_input_file_path)
    verify_mesh(mesh)

def test_write_mesh():
    mesh = read_mesh(test_input_file_path)

    use_compression = False
    write_mesh(mesh, test_output_file_path, use_compression=use_compression)

    mesh = read_mesh(test_output_file_path)
    verify_mesh(mesh)

def test_meshwrite():
    mesh = meshread(test_input_file_path)

    use_compression = False
    meshwrite(mesh, test_output_file_path, use_compression=use_compression)

    mesh = meshread(test_output_file_path)
    verify_mesh(mesh)
