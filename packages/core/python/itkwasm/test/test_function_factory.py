import pytest

def test_function_factory():
    test_accelerator = pytest.importorskip("test_accelerator")

    from itkwasm import function_factory
    interface_package = "itkwasm_example_package"
    func_name = "example_function"
    registered = function_factory.lookup(interface_package, func_name)

    from test_accelerator import slower, faster, fastest

    highest = function_factory.highest_priority(interface_package, func_name)
    assert highest == fastest

    function_factory.set_priority(faster, 30)
    highest = function_factory.highest_priority(interface_package, func_name)
    assert highest == faster

    assert function_factory.get_priority(slower) == -1

    function_factory.disable(interface_package, func_name)
    highest = function_factory.highest_priority(interface_package, func_name)
    assert highest == None

def test_environment_dispatch():
    test_accelerator = pytest.importorskip("test_accelerator")

    from itkwasm import function_factory, environment_dispatch
    interface_package = "itkwasm_example_package"
    func_name = "example_function"

    from test_accelerator import fastest
    function_factory.register(interface_package, func_name, fastest, 1)

    func = environment_dispatch(interface_package, func_name)
    from test_accelerator import fastest
    assert func == fastest
