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

@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_point_set_conversion(selenium, package_wheel):
    import micropip
    await micropip.install(package_wheel)

    from itkwasm import PointSet, PointSetType, PixelTypes, FloatTypes
    from itkwasm.pyodide import to_js, to_py
    import numpy as np

    n_points = 5
    dimension = 3

    points = np.random.random((n_points, dimension)).astype(np.float32)
    point_data = np.random.random((n_points,)).astype(np.float32)

    point_set_type = PointSetType(dimension, FloatTypes.Float32, FloatTypes.Float32, PixelTypes.Scalar, FloatTypes.Float32)

    point_set = PointSet(point_set_type, 'point_set', n_points, points, n_points, point_data)

    point_set_js = to_js(point_set)
    point_set_py = to_py(point_set_js)

    point_set_type_py = point_set_py.pointSetType
    assert point_set_type.dimension == point_set_type_py.dimension
    assert point_set_type.pointComponentType == point_set_type_py.pointComponentType
    assert point_set_type.pointPixelComponentType == point_set_type_py.pointPixelComponentType
    assert point_set_type.pointPixelType == point_set_type_py.pointPixelType
    assert point_set_type.pointPixelComponents == point_set_type_py.pointPixelComponents

    assert point_set.name == point_set_py.name
    assert point_set.numberOfPoints == point_set_py.numberOfPoints
    assert np.array_equal(point_set.points, point_set_py.points)
    assert point_set.numberOfPointPixels == point_set_py.numberOfPointPixels
    assert np.array_equal(point_set.pointData, point_set_py.pointData)