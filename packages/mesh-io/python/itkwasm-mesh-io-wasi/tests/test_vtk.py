from pathlib import Path

from itkwasm_mesh_io_wasi import vtk_poly_data_read_mesh, vtk_poly_data_write_mesh

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / "cow.vtk"
test_output_file_path = test_output_path / "vtk-test-cow.vtk"

import numpy as np

def verify_mesh(mesh):
    assert mesh.meshType.dimension == 3
    from rich import print
    assert mesh.meshType.pointComponentType == "float32"
    assert mesh.meshType.pointPixelComponentType == "int8"
    assert mesh.numberOfPoints == 2903
    assert np.allclose(mesh.points[0],3.71636)
    assert np.allclose(mesh.points[1],2.34339)
    assert mesh.numberOfCells == 3263
    assert mesh.cellBufferSize == 18856
    assert mesh.cells[0] == 4
    assert mesh.cells[1] == 4
    assert mesh.cells[2] == 250

def test_vtk_read_mesh():
    print(test_input_file_path)
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