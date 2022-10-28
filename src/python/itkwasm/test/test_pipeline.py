from pathlib import Path, PurePosixPath
import tempfile
from dataclasses import asdict

import itk
import numpy as np

from itkwasm import InterfaceTypes, TextStream, BinaryStream, PipelineInput, PipelineOutput, Pipeline, TextFile, BinaryFile, Image

test_input_dir = Path(__file__).resolve().parent / 'input'
test_baseline_dir = Path(__file__).resolve().parent / 'baseline'


def test_stdout_stderr():
    pipeline = Pipeline(test_input_dir / 'stdout-stderr-test.wasi.wasm')
    pipeline.run([])

def test_pipeline_bytes():
    pipeline_path = test_input_dir / 'stdout-stderr-test.wasi.wasm'
    with open(pipeline_path, 'rb') as fp:
        wasm_bytes = fp.read()
    pipeline = Pipeline(wasm_bytes)
    pipeline.run([])

def test_pipeline_input_output_streams():
    pipeline = Pipeline(test_input_dir / 'input-output-files-test.wasi.wasm')

    pipeline_inputs = [
        PipelineInput(InterfaceTypes.TextStream, TextStream('The answer is 42.')),
        PipelineInput(InterfaceTypes.BinaryStream, BinaryStream(bytes([222, 173, 190, 239]))),
    ]

    pipeline_outputs = [
        PipelineOutput(InterfaceTypes.TextStream),
        PipelineOutput(InterfaceTypes.BinaryStream),
    ]

    args = [
        '--memory-io',
        '--input-text-stream', '0',
        '--input-binary-stream', '1',
        '--output-text-stream', '0',
        '--output-binary-stream', '1'
    ]

    outputs = pipeline.run(args, pipeline_outputs, pipeline_inputs)

    assert outputs[0].type == InterfaceTypes.TextStream
    assert outputs[0].data.data == 'The answer is 42.'
    assert outputs[1].type, InterfaceTypes.BinaryStream
    assert outputs[1].data.data[0], 222
    assert outputs[1].data.data[1], 173
    assert outputs[1].data.data[2], 190
    assert outputs[1].data.data[3], 239

def test_pipeline_input_output_files():
    pipeline = Pipeline(test_input_dir / 'input-output-files-test.wasi.wasm')
    input_text_file = PurePosixPath(test_input_dir / 'input.txt')
    input_binary_file = PurePosixPath(test_input_dir / 'input.bin')

    with tempfile.TemporaryDirectory() as tmpdirname:
        output_text_file = PurePosixPath(Path(tmpdirname) / 'output.txt')
        output_binary_file = PurePosixPath(Path(tmpdirname) / 'output.bin')

        pipeline_inputs = [
            PipelineInput(InterfaceTypes.TextFile, TextFile(input_text_file)),
            PipelineInput(InterfaceTypes.BinaryFile, BinaryFile(input_binary_file)),
        ]

        pipeline_outputs = [
            PipelineOutput(InterfaceTypes.TextFile, TextFile(output_text_file)),
            PipelineOutput(InterfaceTypes.BinaryFile, BinaryFile(output_binary_file)),
        ]

        args = [
            '--use-files',
            '--input-text-file', str(input_text_file),
            '--input-binary-file', str(input_binary_file),
            '--output-text-file', str(output_text_file),
            '--output-binary-file', str(output_binary_file)
        ]

        outputs = pipeline.run(args, pipeline_outputs, pipeline_inputs)

        assert outputs[0].type == InterfaceTypes.TextFile
        with open(outputs[0].data.path, 'r') as fp:
            content = fp.read()
            assert content == 'The answer is 42.'
        assert outputs[1].type, InterfaceTypes.BinaryFile
        with open(outputs[1].data.path, 'rb') as fp:
            content = fp.read()
            assert content[0] == 222
            assert content[1] == 173
            assert content[2] == 190
            assert content[3] == 239

def test_pipeline_write_read_image():
    pipeline = Pipeline(test_input_dir / 'median-filter-test.wasi.wasm')

    data = test_input_dir / "cthead1.png"
    itk_image = itk.imread(data, itk.UC)
    itk_image_dict = itk.dict_from_image(itk_image)
    itkwasm_image = Image(**itk_image_dict)

    pipeline_inputs = [
        PipelineInput(InterfaceTypes.Image, itkwasm_image),
    ]

    pipeline_outputs = [
        PipelineOutput(InterfaceTypes.Image),
    ]

    args = [
        '0',
        '0',
        '--radius', '2', '--memory-io',]

    outputs = pipeline.run(args, pipeline_outputs, pipeline_inputs)

    out_image = itk.image_from_dict(asdict(outputs[0].data))
    # To be addresses in itk-5.3.1
    out_image.SetRegions([256,256])

    baseline = itk.imread(test_baseline_dir / "test_pipeline_write_read_image.png")

    difference = np.sum(itk.comparison_image_filter(out_image, baseline))
    assert difference == 0.0