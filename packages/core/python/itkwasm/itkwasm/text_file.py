from dataclasses import dataclass
from pathlib import PurePosixPath

@dataclass
class TextFile:
    path: PurePosixPath