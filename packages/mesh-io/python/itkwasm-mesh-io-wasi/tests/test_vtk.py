from pathlib import Path

from itkwasm import FloatTypes, IntTypes
import numpy as np

from itkwasm_mesh_io_wasi import vtk_poly_data_read_mesh, vtk_poly_data_write_mesh

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / "cow.vtk"
test_output_file_path = test_output_path / "vtk-test-cow.vtk"

def verify_mesh(mesh):
    assert mesh.meshType.dimension == 3
    assert mesh.meshType.pointComponentType == FloatTypes.Float32
    assert mesh.meshType.pointPixelComponentType == IntTypes.UInt8
    assert mesh.numberOfPoints == 2903
    assert np.allclose(mesh.points.ravel()[0], 3.71636)
    assert np.allclose(mesh.points.ravel()[1], 2.34339)
    print(mesh.points.shape)
    assert mesh.numberOfCells == 3263
    assert mesh.cellBufferSize == 18856
    assert mesh.cells[0] == 4
    assert mesh.cells[1] == 4
    assert mesh.cells[2] == 250

def test_vtk_read_mesh():
    could_read, mesh = vtk_poly_data_read_mesh(test_input_file_path)
    assert could_read
    verify_mesh(mesh)

def test_vtk_write_mesh():
    could_read, mesh = vtk_poly_data_read_mesh(test_input_file_path)
    assert could_read

    use_compression = False
    could_write = vtk_poly_data_write_mesh(mesh, test_output_file_path, use_compression=use_compression)
    assert could_write

    could_read, mesh = vtk_poly_data_read_mesh(test_output_file_path)
    assert could_read
    verify_mesh(mesh)
