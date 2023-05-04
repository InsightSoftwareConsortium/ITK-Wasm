from enum import Enum

class InterfaceTypes(Enum):
    TextFile = 'InterfaceTextFile'
    BinaryFile = 'InterfaceBinaryFile'
    TextStream = 'InterfaceTextStream'
    BinaryStream = 'InterfaceBinaryStream'
    Image = 'InterfaceImage'
    Mesh = 'InterfaceMesh'
    PolyData = 'InterfacePolyData'
    JsonObject = 'InterfaceJsonObject'