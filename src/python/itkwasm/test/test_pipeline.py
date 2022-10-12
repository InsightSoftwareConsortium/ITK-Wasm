from pathlib import Path

from itkwasm import InterfaceTypes, TextStream, BinaryStream, PipelineInput, PipelineOutput, Pipeline

test_input_dir = Path(__file__).resolve().parent / 'input'


def test_stdout_stderr():
    pipeline = Pipeline(test_input_dir / 'stdout-stderr-test.wasi.wasm')
    pipeline.run([])

def test_pipeline_bytes():
    pipeline_path = test_input_dir / 'stdout-stderr-test.wasi.wasm'
    with open(pipeline_path, 'rb') as fp:
        wasm_bytes = fp.read()
    pipeline = Pipeline(wasm_bytes)
    pipeline.run([])

def test_pipeline_input_output_files():
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