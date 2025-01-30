from pathlib import Path

from itkwasm_mesh_io import read_mesh
from itkwasm_compare_meshes import compare_meshes

from itkwasm_mesh_filters_wasi import slice_mesh

from .common import test_baseline_path

def test_slice_mesh():
    input_mesh_path = test_baseline_path / "suzanne-repair.off"
    input_mesh = read_mesh(input_mesh_path)

    planes = [
        {
        "origin": [0.0, 0.0, 0.0],
        "normal": [0.0, 0.0, 1.0],
        },
        {
        "origin": [0.0, 0.0, 1.0],
        "normal": [0.0, 0.0, 1.0],
        },
        {
        "origin": [0.0, 0.0, 2.0],
        "normal": [0.0, 0.0, 1.0],
        },
    ]

    polylines = slice_mesh(input_mesh, planes)

    assert polylines

    # baseline_mesh_path = test_baseline_path / "suzanne-slice.iwm.cbor"
    # baseline_mesh = read_mesh(baseline_mesh_path)

    # TODO: uncomment after mesh type is supported?
    # comparison = compare_meshes(polylines, baseline_meshes=[baseline_mesh])

    # assert comparison[0]['almostEqual']