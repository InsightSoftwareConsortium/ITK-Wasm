from pathlib import Path
from typing import List, Union

from wasmer import engine, wasi, Store, Module, ImportObject, Instance
from wasmer_compiler_cranelift import Compiler


class Pipeline:
    """Run an itk-wasm WASI pipeline."""

    def __init__(self, pipeline: Union[str, Path, bytes]):
        """Compile the pipeline."""
        self.engine = engine.Universal(Compiler)
        if isinstance(pipeline, bytes):
            wasm_bytes = pipeline
        else:
            with open(pipeline, 'rb') as fp:
                wasm_bytes = fp.read()
        self.store = Store(self.engine)
        self.module = Module(self.store, wasm_bytes)
        self.wasi_version = wasi.get_version(self.module, strict=True)

    def run(self, args: List[str], outputs=[], inputs=[], preopen_directories=[], map_directories={}, environments={}):
        """Run the itk-wasm pipeline."""

        wasi_state = wasi.StateBuilder('itk-wasm-pipeline')
        wasi_state.arguments(args)
        wasi_state.environments(environments)
        wasi_state.map_directories(map_directories)
        wasi_state.preopen_directories(preopen_directories)
        wasi_env = wasi_state.finalize()
        import_object = wasi_env.generate_import_object(self.store, self.wasi_version)

        instance = Instance(self.module, import_object)

        start = instance.exports._start
        start()
