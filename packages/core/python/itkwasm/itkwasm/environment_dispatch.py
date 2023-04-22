from typing import Callable, Tuple, Dict, Optional, Set
import sys
import importlib
import sys
if sys.version_info < (3, 10):
    from importlib_metadata import entry_points
else:
    from importlib.metadata import entry_points

class FunctionFactory:
    def __init__(self):
        self._registered: Dict[Tuple[str, str], Set[Callable]] = {}
        self._priorities: Dict[Callable, int] = {}
        self._has_entry_point_lookup: Set[Tuple[str, str]] = set()

    def register(self, interface_package: str, func_name: str, func: Callable, priority: int=1)-> None:
        key = (interface_package, func_name)
        registered = self._registered.get(key, set())
        registered.add(func)
        self._registered[key] = registered
        self._priorities[func] = priority

    def lookup(self, interface_package: str, func_name: str) -> Optional[Set[Callable]]:
        key = (interface_package, func_name)
        if not key in self._has_entry_point_lookup:
            discovered_funcs = entry_points(group=f'{interface_package}.{func_name}')
            for ep in discovered_funcs:
                priority = ep.name.partition('.priority.')[2]
                if priority:
                    priority = int(priority)
                else:
                    priority = 1
                func = ep.load()
                self.register(interface_package, func_name, func, priority)
            self._has_entry_point_lookup.add(key)
        return self._registered.get(key, None)

    def highest_priority(self, interface_package: str, func_name: str) -> Optional[Callable]:
        """Highest priority registered function with priority > 0."""
        registered = self.lookup(interface_package, func_name)
        if registered is None:
            return None
        highest = max(self._registered[(interface_package, func_name)], key=lambda x: self._priorities[x])
        if self._priorities[highest] < 1:
            return None
        return highest

    def set_priority(self, func: Callable, priority: int)-> None:
        if func not in self._priorities:
            raise ValueError(f"Function {func} has not been registered")
        self._priorities[func] = priority

    def get_priority(self, func: Callable)-> int:
        if func not in self._priorities:
            raise ValueError(f"Function {func} has not been registered")
        return self._priorities[func]

    def disable(self, interface_package: str, func_name: str):
        """Set the priorites of all registered functions to -1."""
        registered = self.lookup(interface_package, func_name)
        for func in registered:
            self._priorities[func] = -1

function_factory = FunctionFactory()

def environment_dispatch(interface_package: str, func_name: str) -> Callable:
    factory_func = function_factory.highest_priority(interface_package, func_name)
    if factory_func is not None:
        return factory_func

    if sys.platform != "emscripten":
        if func_name.endswith('_async'):
            raise ValueError('async function are only implemented for emscripten')
        package = f"{interface_package}_wasi"
    else:
        if not func_name.endswith('_async'):
            raise ValueError('emscripten only implements the _async version of this function')
        package = f"{interface_package}_emscripten"
    mod = importlib.import_module(package)
    func = getattr(mod, func_name)

    return func