from enum import Enum

class PixelTypes(str, Enum):
    Unknown = 'Unknown'
    Scalar = 'Scalar'
    RGB = 'RGB'
    RGBA = 'RGBA'
    Offset = 'Offset'
    Vector = 'Vector'
    Point = 'Point'
    CovariantVector = 'CovariantVector'
    SymmetricSecondRankTensor = 'SymmetricSecondRankTensor'
    DiffusionTensor3D = 'DiffusionTensor3D'
    Complex = 'Complex'
    FixedArray = 'FixedArray'
    Array = 'Array'
    Matrix = 'Matrix'
    VariableLengthVector = 'VariableLengthVector'
    VariableSizeMatrix = 'VariableSizeMatrix'

    def __str__(self):
        return str(self.value)

    def __repr__(self):
        return f'"{str(self.value)}"'
