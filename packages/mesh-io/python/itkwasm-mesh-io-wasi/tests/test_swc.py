from pathlib import Path

from itkwasm import FloatTypes, IntTypes, PixelTypes

from itkwasm_mesh_io_wasi import swc_read_mesh, swc_write_mesh

from .common import test_input_path, test_output_path

test_input_file_path = test_input_path / "11706c2.CNG.swc"
test_output_file_path = test_output_path / "swc-test-11706c2.CNG.swc"

def verify_mesh(mesh):
    assert mesh.meshType.dimension == 3
    assert mesh.meshType.pointComponentType == FloatTypes.Float32
    assert mesh.meshType.cellComponentType == IntTypes.UInt32
    assert mesh.meshType.pointPixelType == PixelTypes.Scalar
    assert mesh.meshType.cellPixelType == PixelTypes.Scalar
    assert mesh.numberOfPoints == 1534
    assert mesh.numberOfPointPixels == 1534
    assert mesh.numberOfCells == 1533
    assert mesh.cellBufferSize == 6132

def test_swc_read_mesh():
    could_read, mesh = swc_read_mesh(test_input_file_path)
    assert could_read
    verify_mesh(mesh)

def test_swc_write_mesh():
    could_read, mesh = swc_read_mesh(test_input_file_path)
    assert could_read

    use_compression = False
    could_write = swc_write_mesh(mesh, test_output_file_path, use_compression=use_compression)
    assert could_write

    could_read, mesh = swc_read_mesh(test_output_file_path)
    assert could_read
    verify_mesh(mesh)