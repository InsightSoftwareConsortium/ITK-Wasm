from dataclasses import dataclass

@dataclass
class BinaryFile:
    data: bytes
    path: str