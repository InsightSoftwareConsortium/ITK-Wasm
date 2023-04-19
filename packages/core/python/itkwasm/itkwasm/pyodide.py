from dataclasses import dataclass, asdict
from typing import Optional

from .image import Image, ImageType
from .pointset import PointSet, PointSetType
from .mesh import Mesh, MeshType
from .polydata import PolyData, PolyDataType
from .binary_file import BinaryFile
from .binary_stream import BinaryStream
from .text_file import TextFile
from .text_stream import TextStream
from .float_types import FloatTypes
from .int_types import IntTypes
from .pixel_types import PixelTypes
from ._to_numpy_array import _to_numpy_array

@dataclass
class JsPackageConfig:
    module_url: str
    pipelines_base_url: Optional[str] = None
    pipeline_worker_url: Optional[str] = None

class JsPackage:
    def __init__(self, config: JsPackageConfig):
        self._config = config
        self._js_module = None

    @property
    def config(self):
        return self._config

    @config.setter
    def config(self, value):
        self._config = value

    @property
    async def js_module(self):
        if self._js_module is not None:
            return self._js_module
        from pyodide.code import run_js
        js_module = await run_js(f"import('{self._config.module_url}')")
        if self._config.pipelines_base_url is not None:
            js_module.setPipelinesBaseUrl(self._config.pipelines_base_url)
        if self._config.pipeline_worker_url is not None:
            js_module.setPipelineWorkerUrl(self._config.pipeline_worker_url)
        self._js_module = js_module
        return js_module

class JsResources:
    def __init__(self):
        self._web_worker = None

    @property
    def web_worker(self):
        return self._web_worker

    @web_worker.setter
    def web_worker(self, value):
        self._web_worker = value

js_resources = JsResources()

def to_py(js_proxy):
    import pyodide
    if hasattr(js_proxy, "imageType"):
        image_dict = js_proxy.to_py()
        image_type = ImageType(**image_dict['imageType'])
        image_dict['imageType'] = image_type
        dimension = image_type.dimension
        component_type = image_type.componentType
        image_dict['direction'] = _to_numpy_array(str(FloatTypes.Float64), image_dict['direction']).reshape((dimension, dimension))
        image_dict['data'] = _to_numpy_array(component_type, image_dict['data']).reshape((dimension, dimension))
        return Image(**image_dict)
    elif hasattr(js_proxy, "pointSetType"):
        point_set_dict = js_proxy.to_py()
        point_set_type = PointSetType(**point_set_dict['pointSetType'])
        point_set_dict['pointSetType'] = point_set_type
        dimension = point_set_type.dimension
        point_component_type = point_set_type.pointComponentType
        point_pixel_component_type = point_set_type.pointPixelComponentType
        point_set_dict['points'] = _to_numpy_array(point_component_type, point_set_dict['points']).reshape((-1, dimension))
        point_set_dict['pointData'] = _to_numpy_array(point_pixel_component_type, point_set_dict['pointData'])
        return PointSet(**point_set_dict)
    return js_proxy.to_py()

def to_js(py):
    import pyodide
    import js
    if isinstance(py, Image):
        image_dict = asdict(py)
        print('to_js image dict', image_dict['imageType'])
        image_dict['direction'] = image_dict['direction'].ravel()
        image_dict['data'] = image_dict['data'].ravel()
        return pyodide.ffi.to_js(image_dict, dict_converter=js.Object.fromEntries)
    elif isinstance(py, PointSet):
        point_set_dict = asdict(py)
        point_set_dict['points'] = point_set_dict['points'].ravel()
        point_set_dict['pointData'] = point_set_dict['pointData'].ravel()
        return pyodide.ffi.to_js(point_set_dict, dict_converter=js.Object.fromEntries)

    return py
