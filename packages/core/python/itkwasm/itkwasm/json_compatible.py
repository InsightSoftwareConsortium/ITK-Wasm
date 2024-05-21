from typing import Dict, Union, List

JsonCompatible = Union[Dict[str, "JsonCompatible"], None, bool, str, int, float, List["JsonCompatible"]]
