from pathlib import Path

from itkwasm import FloatTypes, IntTypes, PixelTypes

from itkwasm_mesh_io_wasi import free_surfer_ascii_read_mesh, free_surfer_ascii_write_mesh, free_surfer_binary_read_mesh, free_surfer_binary_write_mesh

from .common import test_input_path, test_output_path

test_ascii_input_file_path = test_input_path / "sphere.fsa"
test_ascii_output_file_path = test_output_path / "free-surfer-ascii-test-sphere.fsa"
test_binary_input_file_path = test_input_path / "sphere.fsb"
test_binary_output_file_path = test_output_path / "free-surfer-binary-test-sphere.fsb"

def verify_mesh(mesh):
    assert mesh.meshType.dimension == 3
    assert mesh.meshType.pointComponentType == FloatTypes.Float32
    assert mesh.meshType.cellComponentType == IntTypes.UInt32
    assert mesh.meshType.pointPixelType == PixelTypes.Scalar
    assert mesh.meshType.cellPixelType == PixelTypes.Scalar
    assert mesh.numberOfPoints == 162
    assert mesh.numberOfCells == 320

def test_free_surfer_ascii_read_mesh():
    could_read, mesh = free_surfer_ascii_read_mesh(test_ascii_input_file_path)
    assert could_read
    verify_mesh(mesh)

def test_free_surfer_ascii_write_mesh():
    could_read, mesh = free_surfer_ascii_read_mesh(test_ascii_input_file_path)
    assert could_read

    use_compression = False
    could_write = free_surfer_ascii_write_mesh(mesh, test_ascii_output_file_path, use_compression=use_compression)
    assert could_write

    could_read, mesh = free_surfer_ascii_read_mesh(test_ascii_output_file_path)
    assert could_read
    verify_mesh(mesh)

def test_free_surfer_binary_read_mesh():
    could_read, mesh = free_surfer_binary_read_mesh(test_binary_input_file_path)
    assert could_read
    verify_mesh(mesh)

def test_free_surfer_binary_write_mesh():
    could_read, mesh = free_surfer_binary_read_mesh(test_binary_input_file_path)
    assert could_read

    use_compression = False
    could_write = free_surfer_binary_write_mesh(mesh, test_binary_output_file_path, use_compression=use_compression)
    assert could_write

    could_read, mesh = free_surfer_binary_read_mesh(test_binary_output_file_path)
    assert could_read
    verify_mesh(mesh)