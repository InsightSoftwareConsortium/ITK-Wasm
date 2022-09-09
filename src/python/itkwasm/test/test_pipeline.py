from itkwasm import Pipeline

from pathlib import Path

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