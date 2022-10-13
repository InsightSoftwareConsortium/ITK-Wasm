import json
from pathlib import Path
from typing import List, Union, Dict
from .interface_types import InterfaceTypes
from .pipeline_input import PipelineInput
from .pipeline_output import PipelineOutput
from .text_stream import TextStream
from .binary_stream import BinaryStream

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

    def run(self, args: List[str], outputs: List[PipelineOutput]=[], inputs: List[PipelineInput]=[], preopen_directories=[], map_directories={}, environments={}) -> List[PipelineOutput]:
        """Run the itk-wasm pipeline."""

        wasi_state = wasi.StateBuilder('itk-wasm-pipeline')
        wasi_state.arguments(args)
        wasi_state.environments(environments)
        wasi_state.map_directories(map_directories)
        wasi_state.preopen_directories(preopen_directories)
        wasi_env = wasi_state.finalize()
        import_object = wasi_env.generate_import_object(self.store, self.wasi_version)

        instance = Instance(self.module, import_object)
        self.memory = instance.exports.memory
        self.input_array_alloc = instance.exports.itk_wasm_input_array_alloc
        self.input_json_alloc = instance.exports.itk_wasm_input_json_alloc
        self.output_array_address = instance.exports.itk_wasm_output_array_address
        self.output_array_size = instance.exports.itk_wasm_output_array_size
        self.output_json_address = instance.exports.itk_wasm_output_json_address
        self.output_json_size = instance.exports.itk_wasm_output_json_size

        _initialize = instance.exports._initialize
        _initialize()

        for index, input_ in enumerate(inputs):
            if input_.type == InterfaceTypes.TextStream:
                data_array = input_.data.data.encode()
                array_ptr = self._set_input_array(data_array, index, 0)
                data_json = { "size": len(data_array), "data": f"data:application/vnd.itk.address,0:{array_ptr}" }
                self._set_input_json(data_json, index)
            elif input_.type == InterfaceTypes.BinaryStream:
                data_array = input_.data.data
                array_ptr = self._set_input_array(data_array, index, 0)
                data_json = { "size": len(data_array), "data": f"data:application/vnd.itk.address,0:{array_ptr}" }
                self._set_input_json(data_json, index)
            else:
                raise ValueError(f'Unexpected/not yet supported input.type {input_.type}')

        delayed_start = instance.exports.itk_wasm_delayed_start
        return_code = delayed_start()

        populated_outputs: List[PipelineOutput] = []
        if len(outputs) and return_code == 0:
            for index, output in enumerate(outputs):
                output_data = None
                if output.type == InterfaceTypes.TextStream:
                    data_ptr = self.output_array_address(0, index, 0)
                    data_size = self.output_array_size(0, index, 0)
                    data_array_view = bytearray(memoryview(self.memory.buffer)[data_ptr:data_ptr+data_size])
                    output_data = PipelineOutput(InterfaceTypes.TextStream, TextStream(data_array_view.decode()))
                elif output.type == InterfaceTypes.BinaryStream:
                    data_ptr = self.output_array_address(0, index, 0)
                    data_size = self.output_array_size(0, index, 0)
                    data_array = bytes(memoryview(self.memory.buffer)[data_ptr:data_ptr+data_size])
                    output_data = PipelineOutput(InterfaceTypes.BinaryStream, BinaryStream(data_array))
                populated_outputs.append(output_data)

        delayed_exit = instance.exports.itk_wasm_delayed_exit
        delayed_exit(return_code)

        # Should we be returning the return_code?
        return populated_outputs

    def _set_input_array(self, data_array: bytes, input_index: int, sub_index: int) -> int:
        data_ptr = 0
        if data_array != None:
            data_ptr = self.input_array_alloc(0, input_index, sub_index, len(data_array))
            buf = memoryview(self.memory.buffer)
            buf[data_ptr:data_ptr+len(data_array)] = data_array
        return data_ptr

    def _set_input_json(self, data_object: Dict, input_index: int) -> None:
        data_json = json.dumps(data_object).encode()
        json_ptr = self.input_json_alloc(0, input_index, len(data_json))
        buf = memoryview(self.memory.buffer)
        buf[json_ptr:json_ptr+len(data_json)] = data_json