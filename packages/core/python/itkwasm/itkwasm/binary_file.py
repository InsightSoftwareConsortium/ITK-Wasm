from dataclasses import dataclass
from pathlib import PurePosixPath

@dataclass
class BinaryFile:
    path: PurePosixPath