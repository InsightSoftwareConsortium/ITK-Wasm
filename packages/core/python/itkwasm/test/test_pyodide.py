from pytest_pyodide import run_in_pyodide
import pytest

from itkwasm import __version__ as test_package_version

@pytest.fixture
def package_wheel():
    return f"itkwasm-{test_package_version}-py3-none-any.whl"

@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_image_conversion(selenium, package_wheel):
    import micropip
    await micropip.install(package_wheel)

    from itkwasm import Image
    from itkwasm.pyodide import to_js, to_py
    import numpy as np

    image = Image()

    assert image.imageType.dimension == 2
    assert image.imageType.componentType == 'uint8'
    assert image.imageType.pixelType == 'Scalar'
    assert image.imageType.components == 1

    assert image.name == "image"
    assert image.origin[0] == 0.0
    assert image.origin[1] == 0.0
    assert image.spacing[0] == 1.0
    assert image.spacing[1] == 1.0
    assert np.array_equal(image.direction, np.eye(2).astype(np.float64))

    assert image.size[0] == 1
    assert image.size[1] == 1
    image.size = [2, 2]

    assert isinstance(image.metadata, dict)
    assert image.data == None
    image.data = np.arange(4, dtype=np.uint8).reshape((2,2))
    image_js = to_js(image)

    image_py = to_py(image_js)
    assert image_py.imageType.dimension == 2
    assert image_py.imageType.componentType == 'uint8'
    assert image_py.imageType.pixelType == 'Scalar'
    assert image_py.imageType.components == 1

    assert image_py.name == "image"
    assert image_py.origin[0] == 0.0
    assert image_py.origin[1] == 0.0
    assert image_py.spacing[0] == 1.0
    assert image_py.spacing[1] == 1.0
    assert np.array_equal(image_py.direction, np.eye(2).astype(np.float64))

    assert image_py.size[0] == 2
    assert image_py.size[1] == 2

    assert isinstance(image_py.metadata, dict)
    assert np.array_equal(image_py.data, np.arange(4, dtype=np.uint8).reshape((2,2)))