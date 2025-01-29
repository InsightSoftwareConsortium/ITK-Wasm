from pathlib import Path

from itkwasm_mesh_io import read_mesh
from itkwasm_compare_meshes import compare_meshes

from itkwasm_mesh_filters_wasi import keep_largest_component

from .common import test_input_path, test_baseline_path

def test_keep_largest_component():
    input_mesh_path = test_input_path / "suzanne.off"
    input_mesh = read_mesh(input_mesh_path)

    output_mesh = keep_largest_component(input_mesh)

    baseline_mesh_path = test_baseline_path / "suzanne-keep-largest-component.iwm.cbor"
    baseline_mesh = read_mesh(baseline_mesh_path)

    comparison = compare_meshes(output_mesh, baseline_meshes=[baseline_mesh])

    assert comparison[0]['almostEqual']

