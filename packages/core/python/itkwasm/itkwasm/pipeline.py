import json
from pathlib import Path, PurePosixPath
from dataclasses import asdict
from typing import List, Union, Dict, Tuple
import ctypes
import sys

import numpy as np

from .interface_types import InterfaceTypes
from .pipeline_input import PipelineInput
from .pipeline_output import PipelineOutput
from .text_stream import TextStream
from .binary_stream import BinaryStream
from .text_file import TextFile
from .binary_file import BinaryFile
from .image import Image
from .mesh import Mesh
from .polydata import PolyData
from .json_object import JsonObject
from .int_types import IntTypes
from .float_types import FloatTypes
from ._to_numpy_array import _to_numpy_array

if sys.platform != "emscripten":
    from wasmtime import Config, Store, Engine, Module, WasiConfig, Linker

class Pipeline:
    """Run an itk-wasm WASI pipeline."""

    def __init__(self, pipeline: Union[str, Path, bytes]):
        """Compile the pipeline."""
        self.config = Config()
        self.config.wasm_bulk_memory = True
        self.engine = Engine(self.config)
        if isinstance(pipeline, bytes):
            wasm_bytes = pipeline
        else:
            with open(pipeline, 'rb') as fp:
                wasm_bytes = fp.read()
        self.store = Store(self.engine)
        self.linker = Linker(self.engine)
        self.linker.allow_shadowing = True
        self.module = Module(self.engine, wasm_bytes)

    def run(self, args: List[str], outputs: List[PipelineOutput]=[], inputs: List[PipelineInput]=[]) -> Tuple[PipelineOutput]:
        """Run the itk-wasm pipeline."""
        store = self.store

        wasi_config = WasiConfig()
        wasi_config.inherit_env()
        wasi_config.inherit_stderr()
        wasi_config.inherit_stdin()
        wasi_config.inherit_stdout()
        wasi_config.argv = args

        preopen_directories=set()
        for index, input_ in enumerate(inputs):
            if input_.type == InterfaceTypes.TextFile or input_.type == InterfaceTypes.BinaryFile:
                preopen_directories.add(str(PurePosixPath(input_.data.path).parent))
        for index, output in enumerate(outputs):
            if output.type == InterfaceTypes.TextFile or output.type == InterfaceTypes.BinaryFile:
                preopen_directories.add(str(PurePosixPath(output.data.path).parent))
        preopen_directories = list(preopen_directories)
        for preopen in preopen_directories:
            wasi_config.preopen_dir(preopen, preopen)
        store.set_wasi(wasi_config)

        self.linker.define_wasi()
        instance = self.linker.instantiate(store, self.module)

        self.memory = instance.exports(store)["memory"]
        self.input_array_alloc = instance.exports(store)["itk_wasm_input_array_alloc"]
        self.input_json_alloc = instance.exports(store)["itk_wasm_input_json_alloc"]
        self.output_array_address = instance.exports(store)["itk_wasm_output_array_address"]
        self.output_array_size = instance.exports(store)["itk_wasm_output_array_size"]
        self.output_json_address = instance.exports(store)["itk_wasm_output_json_address"]
        self.output_json_size = instance.exports(store)["itk_wasm_output_json_size"]

        _initialize = instance.exports(store)["_initialize"]
        _initialize(store)

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
            elif input_.type == InterfaceTypes.TextFile:
                pass
            elif input_.type == InterfaceTypes.BinaryFile:
                pass
            elif input_.type == InterfaceTypes.Image:
                image = input_.data
                mv = bytes(image.data.data)
                data_ptr = self._set_input_array(mv, index, 0)
                dv = bytes(image.direction.data)
                direction_ptr = self._set_input_array(dv, index, 1)
                image_json = {
                    "imageType": asdict(image.imageType),
                    "name": image.name,
                    "origin": image.origin,
                    "spacing": image.spacing,
                    "direction": f"data:application/vnd.itk.address,0:{direction_ptr}",
                    "size": image.size,
                    "data": f"data:application/vnd.itk.address,0:{data_ptr}"
                }
                self._set_input_json(image_json, index)
            elif input_.type == InterfaceTypes.Mesh:
                mesh = input_.data
                if mesh.numberOfPoints:
                    pv = bytes(mesh.points)
                else:
                    pv = bytes([])
                points_ptr = self._set_input_array(pv, index, 0)
                if mesh.numberOfCells:
                    cv = bytes(mesh.cells)
                else:
                    cv = bytes([])
                cells_ptr = self._set_input_array(cv, index, 1)
                if mesh.numberOfPointPixels:
                    pdv = bytes(mesh.pointData)
                else:
                    pdv = bytes([])
                point_data_ptr = self._set_input_array(pdv, index, 2)
                if mesh.numberOfCellPixels:
                    cdv = bytes(mesh.cellData)
                else:
                    cdv = bytes([])
                cell_data_ptr = self._set_input_array(cdv, index, 3)
                mesh_json = {
                    "meshType": asdict(mesh.meshType),
                    "name": mesh.name,

                    "numberOfPoints": mesh.numberOfPoints,
                    "points": f"data:application/vnd.itk.address,0:{points_ptr}",

                    "numberOfCells": mesh.numberOfCells,
                    "cells": f"data:application/vnd.itk.address,0:{cells_ptr}",
                    "cellBufferSize": mesh.cellBufferSize,

                    "numberOfPointPixels": mesh.numberOfPointPixels,
                    "pointData": f"data:application/vnd.itk.address,0:{point_data_ptr}",

                    "numberOfCellPixels": mesh.numberOfCellPixels,
                    "cellData": f"data:application/vnd.itk.address,0:{cell_data_ptr}",
                }
                self._set_input_json(mesh_json, index)
            elif input_.type == InterfaceTypes.PolyData:
                polydata = input_.data
                if polydata.numberOfPoints:
                    pv = bytes(polydata.points)
                else:
                    pv = bytes([])
                points_ptr = self._set_input_array(pv, index, 0)

                if polydata.verticesBufferSize:
                    pv = bytes(polydata.vertices)
                else:
                    pv = bytes([])
                vertices_ptr = self._set_input_array(pv, index, 1)

                if polydata.linesBufferSize:
                    pv = bytes(polydata.lines)
                else:
                    pv = bytes([])
                lines_ptr = self._set_input_array(pv, index, 2)

                if polydata.polygonsBufferSize:
                    pv = bytes(polydata.polygons)
                else:
                    pv = bytes([])
                polygons_ptr = self._set_input_array(pv, index, 3)

                if polydata.triangleStripsBufferSize:
                    pv = bytes(polydata.triangleStrips)
                else:
                    pv = bytes([])
                triangleStrips_ptr = self._set_input_array(pv, index, 4)

                if polydata.numberOfPointPixels:
                    pv = bytes(polydata.pointData)
                else:
                    pv = bytes([])
                pointData_ptr = self._set_input_array(pv, index, 5)

                if polydata.numberOfCellPixels:
                    pv = bytes(polydata.cellData)
                else:
                    pv = bytes([])
                cellData_ptr = self._set_input_array(pv, index, 6)

                polydata_json = {
                    "polyDataType": asdict(polydata.polyDataType),
                    "name": polydata.name,

                    "numberOfPoints": polydata.numberOfPoints,
                    "points": f"data:application/vnd.itk.address,0:{points_ptr}",

                    "verticesBufferSize": polydata.verticesBufferSize,
                    "vertices": f"data:application/vnd.itk.address,0:{vertices_ptr}",

                    "linesBufferSize": polydata.linesBufferSize,
                    "lines": f"data:application/vnd.itk.address,0:{lines_ptr}",

                    "polygonsBufferSize": polydata.polygonsBufferSize,
                    "polygons": f"data:application/vnd.itk.address,0:{polygons_ptr}",

                    "triangleStripsBufferSize": polydata.triangleStripsBufferSize,
                    "triangleStrips": f"data:application/vnd.itk.address,0:{triangleStrips_ptr}",

                    "numberOfPointPixels": polydata.numberOfPointPixels,
                    "pointData": f"data:application/vnd.itk.address,0:{pointData_ptr}",

                    "numberOfCellPixels": polydata.numberOfCellPixels,
                    "cellData": f"data:application/vnd.itk.address,0:{cellData_ptr}"
                }
                self._set_input_json(polydata_json, index)
            elif input_.type == InterfaceTypes.JsonObject:
                data_array = json.dumps(input_.data.data).encode()
                array_ptr = self._set_input_array(data_array, index, 0)
                data_json = { "size": len(data_array), "data": f"data:application/vnd.itk.address,0:{array_ptr}" }
                self._set_input_json(data_json, index)
            else:
                raise ValueError(f'Unexpected/not yet supported input.type {input_.type}')

        delayed_start = instance.exports(store)["itk_wasm_delayed_start"]
        return_code = delayed_start(store)

        populated_outputs: List[PipelineOutput] = []
        if len(outputs) and return_code == 0:
            for index, output in enumerate(outputs):
                output_data = None
                if output.type == InterfaceTypes.TextStream:
                    data_ptr = self.output_array_address(store, 0, index, 0)
                    data_size = self.output_array_size(store, 0, index, 0)
                    data_array = self._wasmtime_lift(data_ptr, data_size)
                    output_data = PipelineOutput(InterfaceTypes.TextStream, TextStream(data_array.decode()))
                elif output.type == InterfaceTypes.BinaryStream:
                    data_ptr = self.output_array_address(store, 0, index, 0)
                    data_size = self.output_array_size(store, 0, index, 0)
                    data_array = self._wasmtime_lift(data_ptr, data_size)
                    output_data = PipelineOutput(InterfaceTypes.BinaryStream, BinaryStream(data_array))
                elif output.type == InterfaceTypes.TextFile:
                    output_data = PipelineOutput(InterfaceTypes.TextFile, TextFile(output.data.path))
                elif output.type == InterfaceTypes.BinaryFile:
                    output_data = PipelineOutput(InterfaceTypes.BinaryFile, BinaryFile(output.data.path))
                elif output.type == InterfaceTypes.Image:
                    image_json = self._get_output_json(index)

                    image = Image(**image_json)

                    data_ptr = self.output_array_address(store, 0, index, 0)
                    data_size = self.output_array_size(store, 0, index, 0)
                    data_array = _to_numpy_array(image.imageType.componentType, self._wasmtime_lift(data_ptr, data_size))
                    shape = list(image.size)[::-1]
                    if image.imageType.components > 1:
                        shape.append(image.imageType.components)
                    image.data = data_array.reshape(tuple(shape))

                    direction_ptr = self.output_array_address(store, 0, index, 1)
                    direction_size = self.output_array_size(store, 0, index, 1)
                    direction_array = _to_numpy_array(FloatTypes.Float64, self._wasmtime_lift(direction_ptr, direction_size))
                    dimension = image.imageType.dimension
                    direction_array.shape = (dimension, dimension)
                    image.direction = direction_array

                    output_data = PipelineOutput(InterfaceTypes.Image, image)
                elif output.type == InterfaceTypes.Mesh:
                    mesh_json = self._get_output_json(index)
                    mesh = Mesh(**mesh_json)

                    if mesh.numberOfPoints > 0:
                        data_ptr = self.output_array_address(store, 0, index, 0)
                        data_size = self.output_array_size(store, 0, index, 0)
                        mesh.points = _to_numpy_array(mesh.meshType.pointComponentType, self._wasmtime_lift(data_ptr, data_size))
                    else:
                        mesh.points =  _to_numpy_array(mesh.meshType.pointComponentType, bytes([]))

                    if mesh.numberOfCells > 0:
                        data_ptr = self.output_array_address(store, 0, index, 1)
                        data_size = self.output_array_size(store, 0, index, 1)
                        mesh.cells = _to_numpy_array(mesh.meshType.cellComponentType, self._wasmtime_lift(data_ptr, data_size))
                    else:
                        mesh.cells =  _to_numpy_array(mesh.meshType.cellComponentType, bytes([]))
                    if mesh.numberOfPointPixels > 0:
                        data_ptr = self.output_array_address(store, 0, index, 2)
                        data_size = self.output_array_size(store, 0, index, 2)
                        mesh.pointData = _to_numpy_array(mesh.meshType.pointPixelComponentType, self._wasmtime_lift(data_ptr, data_size))
                    else:
                        mesh.pointData =  _to_numpy_array(mesh.meshType.pointPixelComponentType, bytes([]))

                    if mesh.numberOfCellPixels > 0:
                        data_ptr = self.output_array_address(store, 0, index, 3)
                        data_size = self.output_array_size(store, 0, index, 3)
                        mesh.cellData = _to_numpy_array(mesh.meshType.cellPixelComponentType, self._wasmtime_lift(data_ptr, data_size))
                    else:
                        mesh.cellData =  _to_numpy_array(mesh.meshType.cellPixelComponentType, bytes([]))

                    output_data = PipelineOutput(InterfaceTypes.Mesh, mesh)
                elif output.type == InterfaceTypes.PolyData:
                    polydata_json = self._get_output_json(index)
                    polydata = PolyData(**polydata_json)

                    if polydata.numberOfPoints > 0:
                        data_ptr = self.output_array_address(store, 0, index, 0)
                        data_size = self.output_array_size(store, 0, index, 0)
                        polydata.points = _to_numpy_array(FloatTypes.Float32, self._wasmtime_lift(data_ptr, data_size))
                    else:
                        polydata.points =  _to_numpy_array(FloatTypes.Float32, bytes([]))

                    if polydata.verticesBufferSize > 0:
                        data_ptr = self.output_array_address(store, 0, index, 1)
                        data_size = self.output_array_size(store, 0, index, 1)
                        polydata.vertices = _to_numpy_array(IntTypes.UInt32, self._wasmtime_lift(data_ptr, data_size))
                    else:
                        polydata.vertices =  _to_numpy_array(IntTypes.UInt32, bytes([]))

                    if polydata.linesBufferSize > 0:
                        data_ptr = self.output_array_address(store, 0, index, 2)
                        data_size = self.output_array_size(store, 0, index, 2)
                        polydata.lines = _to_numpy_array(IntTypes.UInt32, self._wasmtime_lift(data_ptr, data_size))
                    else:
                        polydata.lines =  _to_numpy_array(IntTypes.UInt32, bytes([]))

                    if polydata.polygonsBufferSize > 0:
                        data_ptr = self.output_array_address(store, 0, index, 3)
                        data_size = self.output_array_size(store, 0, index, 3)
                        polydata.polygons = _to_numpy_array(IntTypes.UInt32, self._wasmtime_lift(data_ptr, data_size))
                    else:
                        polydata.polygons =  _to_numpy_array(IntTypes.UInt32, bytes([]))

                    if polydata.triangleStripsBufferSize > 0:
                        data_ptr = self.output_array_address(store, 0, index, 4)
                        data_size = self.output_array_size(store, 0, index, 4)
                        polydata.triangleStrips = _to_numpy_array(IntTypes.UInt32, self._wasmtime_lift(data_ptr, data_size))
                    else:
                        polydata.triangleStrips =  _to_numpy_array(IntTypes.UInt32, bytes([]))

                    if polydata.numberOfPointPixels > 0:
                        data_ptr = self.output_array_address(store, 0, index, 5)
                        data_size = self.output_array_size(store, 0, index, 5)
                        polydata.pointData = _to_numpy_array(polydata.polyDataType.pointPixelComponentType, self._wasmtime_lift(data_ptr, data_size))
                    else:
                        polydata.triangleStrips =  _to_numpy_array(polydata.polyDataType.pointPixelComponentType, bytes([]))

                    if polydata.numberOfCellPixels > 0:
                        data_ptr = self.output_array_address(store, 0, index, 6)
                        data_size = self.output_array_size(store, 0, index, 6)
                        polydata.cellData = _to_numpy_array(polydata.polyDataType.cellPixelComponentType, self._wasmtime_lift(data_ptr, data_size))
                    else:
                        polydata.triangleStrips =  _to_numpy_array(polydata.polyDataType.cellPixelComponentType, bytes([]))

                    output_data = PipelineOutput(InterfaceTypes.PolyData, polydata)
                elif output.type == InterfaceTypes.JsonObject:
                    data_ptr = self.output_array_address(store, 0, index, 0)
                    data_size = self.output_array_size(store, 0, index, 0)
                    data_array = self._wasmtime_lift(data_ptr, data_size)
                    output_data = PipelineOutput(InterfaceTypes.JsonObject, JsonObject(json.loads(data_array.decode())))
                else:
                    raise ValueError(f'Unexpected/not yet supported output.type {output.type}')

                populated_outputs.append(output_data)

        delayed_exit = instance.exports(store)["itk_wasm_delayed_exit"]
        delayed_exit(store, return_code)

        # Should we be returning the return_code?
        return tuple(populated_outputs)

    def _wasmtime_lift(self, ptr: int, size: int):
        ptr = ptr & 0xffffffff
        size = size & 0xffffffff
        if ptr + size > self.memory.data_len(self.store):
            raise IndexError('attempting to lift of bounds')
        raw_base = self.memory.data_ptr(self.store)
        base = ctypes.POINTER(ctypes.c_ubyte)(
            ctypes.c_ubyte.from_address(ctypes.addressof(raw_base.contents) + ptr)
        )
        return ctypes.string_at(base, size)

    def _wasmtime_lower(self, ptr: int, data: Union[bytes, bytearray]):
        ptr = ptr & 0xffffffff
        size = len(data)
        if ptr + size > self.memory.data_len(self.store):
            raise IndexError('attempting to lower out of bounds')
        raw_base = self.memory.data_ptr(self.store)
        base = ctypes.POINTER(ctypes.c_ubyte)(
            ctypes.c_ubyte.from_address(ctypes.addressof(raw_base.contents) + ptr)
        )
        ctypes.memmove(base, data, size)

    def _set_input_array(self, data_array: Union[bytes, bytearray], input_index: int, sub_index: int) -> int:
        data_ptr = 0
        if data_array != None:
            data_ptr = self.input_array_alloc(self.store, 0, input_index, sub_index, len(data_array))
            self._wasmtime_lower(data_ptr, data_array)
        return data_ptr

    def _set_input_json(self, data_object: Dict, input_index: int) -> None:
        data_json = json.dumps(data_object).encode()
        json_ptr = self.input_json_alloc(self.store, 0, input_index, len(data_json))
        self._wasmtime_lower(json_ptr, data_json)

    def _get_output_json(self, output_index: int) -> Dict:
        json_ptr = self.output_json_address(self.store, 0, output_index)
        json_len = self.output_json_size(self.store, 0, output_index)
        json_str = self._wasmtime_lift(json_ptr, json_len).decode()
        json_result = json.loads(json_str)
        return json_result
