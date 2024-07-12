from itkwasm import IntTypes, FloatTypes
import numpy as np

from itkwasm_mesh_io import read_mesh, meshread, write_mesh, meshwrite

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / "cow.vtk"
test_output_file_path = test_output_path / "read-write-cow.vtk"

def verify_mesh(mesh):
    assert mesh.meshType.dimension == 3
    assert mesh.meshType.pointComponentType == FloatTypes.Float32
    assert mesh.meshType.pointPixelComponentType == IntTypes.UInt8
    assert mesh.numberOfPoints == 2903
    assert np.allclose(mesh.points[0],3.71636)
    assert np.allclose(mesh.points[1],2.34339)
    assert mesh.numberOfCells == 3263
    assert mesh.cellBufferSize == 18856
    assert mesh.cells[0] == 4
    assert mesh.cells[1] == 4
    assert mesh.cells[2] == 250

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
