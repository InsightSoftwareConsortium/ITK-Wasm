from pathlib import Path

from itkwasm_mesh_io import read_mesh
from itkwasm_compare_meshes import compare_meshes

from itkwasm_mesh_filters_wasi import smooth_remesh

from .common import test_baseline_path

def test_smooth_remesh():
    input_mesh_path = test_baseline_path / "suzanne-repair.off"
    input_mesh = read_mesh(input_mesh_path)

    output_mesh = smooth_remesh(input_mesh)

    baseline_mesh_path = test_baseline_path / "suzanne-smooth-remesh.iwm.cbor"
    baseline_mesh = read_mesh(baseline_mesh_path)

    comparison = compare_meshes(output_mesh, baseline_meshes=[baseline_mesh])

    assert comparison[0]['almostEqual']
