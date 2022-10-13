from enum import Enum

class FloatTypes(str, Enum):
    Float32 = 'float32'
    Float64 = 'float64'
    SpacePrecisionType = 'float64'

    def __str__(self):
        return str(self.value)

    def __repr__(self):
        return f'"{str(self.value)}"'