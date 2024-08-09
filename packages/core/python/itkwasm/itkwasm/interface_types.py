from enum import Enum

class InterfaceTypes(str, Enum):
    TextFile = "TextFile"
    BinaryFile = "BinaryFile"
    TextStream = "TextStream"
    BinaryStream = "BinaryStream"
    Image = "Image"
    Mesh = "Mesh"
    PolyData = "PolyData"
    Transform = "Transform"
    JsonCompatible = "JsonCompatible"
