from enum import Enum


class IntTypes(str, Enum):
    Int8 = "int8"
    UInt8 = "uint8"
    Int16 = "int16"
    UInt16 = "uint16"
    Int32 = "int32"
    UInt32 = "uint32"
    Int64 = "int64"
    UInt64 = "uint64"

    SizeValueType = "uint64"
    IdentifierType = "uint64"
    IndexValueType = "int64"
    OffsetValueType = "int64"

    def __str__(self):
        return str(self.value)

    def __repr__(self):
        return f'"{str(self.value)}"'
