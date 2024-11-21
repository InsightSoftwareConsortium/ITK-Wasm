from enum import Enum

class InterfaceTypes(str, Enum):
    TextFile = "TextFile"
    BinaryFile = "BinaryFile"
    TextStream = "TextStream"
    BinaryStream = "BinaryStream"
    Image = "Image"
    Mesh = "Mesh"
    PointSet = "PointSet"
    PolyData = "PolyData"
    TransformList = "TransformList"
    JsonCompatible = "JsonCompatible"
