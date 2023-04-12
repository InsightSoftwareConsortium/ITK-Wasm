from typing import Callable
import sys
import importlib

def environment_dispatch(interface_package: str, func_name: str) -> Callable:
    if sys.platform != "emscripten":
        package = f"{interface_package}_wasi"
    else:
        package = f"{interface_package}_emscripten"
    mod = importlib.import_module(package)
    func = getattr(mod, func_name)

    return func