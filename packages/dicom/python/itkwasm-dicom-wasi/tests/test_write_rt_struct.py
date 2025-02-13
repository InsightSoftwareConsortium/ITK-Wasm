import os
import json

from itkwasm_dicom_wasi import write_rt_struct

from .common import test_input_path, test_output_path

def test_write_rt_struct():
    cxt_path = test_input_path / "rt-struct" / "synth-lung-1.cxt"
    rt_struct_path = test_output_path / "python-synth-lung-1-rtss.dcm"
    write_rt_struct(cxt_path, rt_struct_path)

    assert os.path.exists(rt_struct_path)

def test_write_rt_struct_custom_metadata():
    cxt_path = test_input_path / "rt-struct" / "synth-lung-1.cxt"
    metadata_path = test_input_path / "rt-struct" / "dicom-metadata.json"
    with open(metadata_path) as f:
        metadata = json.load(f)
    rt_struct_path = test_output_path / "python-synth-lung-1-rtss-custom-metadata.dcm"
    write_rt_struct(cxt_path, rt_struct_path, dicom_metadata=metadata)

    assert os.path.exists(rt_struct_path)
