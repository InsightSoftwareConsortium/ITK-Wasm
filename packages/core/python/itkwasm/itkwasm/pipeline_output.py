from dataclasses import dataclass
from typing import Optional, Union

from .interface_types import InterfaceTypes
from .text_file import TextFile
from .text_stream import TextStream
from .binary_file import BinaryFile
from .binary_stream import BinaryStream
from .image import Image
from .mesh import Mesh
from .polydata import PolyData

@dataclass
class PipelineOutput:
    type: InterfaceTypes
    data: Optional[Union[str, bytes, TextStream, BinaryStream, TextFile, BinaryFile, Image, Mesh, PolyData]] = None
    path: Optional[str] = None
