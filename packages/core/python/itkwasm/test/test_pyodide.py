import pytest
import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide

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

    assert image.name == "Image"
    assert image.origin[0] == 0.0
    assert image.origin[1] == 0.0
    assert image.spacing[0] == 1.0
    assert image.spacing[1] == 1.0
    assert np.array_equal(image.direction, np.eye(2).astype(np.float64))

    assert image.size[0] == 1
    assert image.size[1] == 1
    image.size = [4, 4]

    assert isinstance(image.metadata, dict)
    image.metadata['a_string'] = 'some text'
    image.metadata['an int'] = 3
    assert image.data == None
    image.data = np.arange(16, dtype=np.uint8).reshape((4,4))
    image_js = to_js(image)

    image_py = to_py(image_js)
    assert image_py.imageType.dimension == 2
    assert image_py.imageType.componentType == 'uint8'
    assert image_py.imageType.pixelType == 'Scalar'
    assert image_py.imageType.components == 1

    assert image_py.name == "Image"
    assert image_py.origin[0] == 0.0
    assert image_py.origin[1] == 0.0
    assert image_py.spacing[0] == 1.0
    assert image_py.spacing[1] == 1.0
    assert np.array_equal(image_py.direction, np.eye(2).astype(np.float64))

    assert image_py.size[0] == 4
    assert image_py.size[1] == 4

    assert image_py.metadata['a_string'] == 'some text'
    assert image_py.metadata['an int'] == 3

    assert isinstance(image_py.metadata, dict)
    assert np.array_equal(image_py.data, np.arange(16, dtype=np.uint8).reshape((4,4)))

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

@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_mesh_conversion(selenium, package_wheel):
    import micropip
    await micropip.install(package_wheel)

    from itkwasm import Mesh, MeshType
    from itkwasm.pyodide import to_js, to_py
    import numpy as np

    n_points = 5
    dimension = 3

    mesh_type = MeshType()

    points = np.random.random((n_points, dimension)).astype(np.float32)
    point_data = np.random.random((n_points,)).astype(np.float32)

    mesh = Mesh(mesh_type, points=points, numberOfPoints=n_points, pointData=point_data, numberOfPointPixels=n_points)

    mesh_js = to_js(mesh)
    mesh_py = to_py(mesh_js)

    mesh_type_py = mesh_py.meshType
    assert mesh_type.dimension == mesh_type_py.dimension
    assert mesh_type.pointComponentType == mesh_type_py.pointComponentType
    assert mesh_type.pointPixelComponentType == mesh_type_py.pointPixelComponentType
    assert mesh_type.pointPixelType == mesh_type_py.pointPixelType
    assert mesh_type.pointPixelComponents == mesh_type_py.pointPixelComponents

    assert mesh.name == mesh_py.name
    assert mesh.numberOfPoints == mesh_py.numberOfPoints
    assert np.array_equal(mesh.points, mesh_py.points)
    assert mesh.numberOfPointPixels == mesh_py.numberOfPointPixels
    assert np.array_equal(mesh.pointData, mesh_py.pointData)

@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_polydata_conversion(selenium, package_wheel):
    import micropip
    await micropip.install(package_wheel)

    from itkwasm import PolyData, PolyDataType
    from itkwasm.pyodide import to_js, to_py
    import numpy as np

    n_points = 5
    dimension = 3

    polydata_type = PolyDataType()

    points = np.random.random((n_points, dimension)).astype(np.float32)
    point_data = np.random.random((n_points,)).astype(np.float32)

    polydata = PolyData(polydata_type, points=points, numberOfPoints=n_points, pointData=point_data, numberOfPointPixels=n_points)

    polydata_js = to_js(polydata)
    polydata_py = to_py(polydata_js)

    polydata_type_py = polydata_py.polyDataType
    assert polydata_type.pointPixelComponentType == polydata_type_py.pointPixelComponentType
    assert polydata_type.pointPixelType == polydata_type_py.pointPixelType
    assert polydata_type.pointPixelComponents == polydata_type_py.pointPixelComponents

    assert polydata.name == polydata_py.name
    assert polydata.numberOfPoints == polydata_py.numberOfPoints
    assert np.array_equal(polydata.points, polydata_py.points)
    assert polydata.numberOfPointPixels == polydata_py.numberOfPointPixels
    assert np.array_equal(polydata.pointData, polydata_py.pointData)

@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_binary_stream_conversion(selenium, package_wheel):
    import micropip
    await micropip.install(package_wheel)

    from itkwasm import BinaryStream
    from itkwasm.pyodide import to_js, to_py

    data = bytes([222,173,190,239])
    binary_stream = BinaryStream(data)

    binary_stream_js = to_js(binary_stream)
    binary_stream_py = to_py(binary_stream_js)

    assert binary_stream_py.data[0], 222
    assert binary_stream_py.data[1], 173
    assert binary_stream_py.data[2], 190
    assert binary_stream_py.data[3], 239

@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_text_stream_conversion(selenium, package_wheel):
    import micropip
    await micropip.install(package_wheel)

    from itkwasm import TextStream
    from itkwasm.pyodide import to_js, to_py

    data = "The answer is 42."
    text_stream = TextStream(data)

    text_stream_js = to_js(text_stream)
    text_stream_py = to_py(text_stream_js)

    assert text_stream_py.data == data

@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_binary_file_conversion(selenium, package_wheel):
    import micropip
    await micropip.install(package_wheel)

    from itkwasm import BinaryFile
    from itkwasm.pyodide import to_js, to_py
    import numpy as np
    from pathlib import PurePosixPath

    data = bytes([222,173,190,239])
    path = PurePosixPath('file.bin')
    with open(path, 'wb') as fp:
        fp.write(data)
    binary_file = BinaryFile(path)

    binary_file_js = to_js(binary_file)
    binary_file_py = to_py(binary_file_js)

    with open(binary_file_py.path, 'rb') as fp:
        data_py = fp.read()

    assert data_py[0], 222
    assert data_py[1], 173
    assert data_py[2], 190
    assert data_py[3], 239

@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_text_file_conversion(selenium, package_wheel):
    import micropip
    await micropip.install(package_wheel)

    from itkwasm import TextFile
    from itkwasm.pyodide import to_js, to_py
    import numpy as np
    from pathlib import PurePosixPath

    data = "The answer is 42."
    path = PurePosixPath('file.txt')
    with open(path, 'w') as fp:
        fp.write(data)
    text_file = TextFile(path)

    text_file_js = to_js(text_file)
    text_file_py = to_py(text_file_js)

    with open(text_file_py.path, 'r') as fp:
        data_py = fp.read()

    assert data_py == data

@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_list_conversion(selenium, package_wheel):
    import micropip
    await micropip.install(package_wheel)

    from itkwasm import TextFile
    from itkwasm.pyodide import to_js, to_py
    import numpy as np
    from pathlib import PurePosixPath

    data = "The answer is 42."

    def create_text_file(index):
        path = PurePosixPath(f'file{index}.txt')
        with open(path, 'w') as fp:
            fp.write(data)
        text_file = TextFile(path)
        return text_file

    text_files = [create_text_file(index) for index in range(4)]

    text_files_js = to_js(text_files)
    text_files_py = to_py(text_files_js)

    def verify_text_file(text_file):
        with open(text_file.path, 'r') as fp:
            data_py = fp.read()

        assert data_py == data

    for text_file in text_files_py:
        verify_text_file(text_file)

@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_uint8array_conversion(selenium, package_wheel):
    import micropip
    await micropip.install(package_wheel)

    from itkwasm.pyodide import to_js, to_py

    data = bytes([222,173,190,239])

    data_js = to_js(data)
    data_py = to_py(data_js)

    assert isinstance(data_py, bytes)

    assert data_py[0], 222
    assert data_py[1], 173
    assert data_py[2], 190
    assert data_py[3], 239

    ivalue = 8
    ivalue_js = to_js(ivalue)
    ivalue_py = to_py(ivalue_js)

    assert ivalue == ivalue_py

@run_in_pyodide(packages=['micropip'])
async def test_json_object_conversion(selenium, package_wheel):
    import micropip
    await micropip.install(package_wheel)

    from itkwasm.pyodide import to_js, to_py
    from itkwasm import JsonObject

    data = { 'a': 1, 'b': True, 'c': { 'nested': True }}

    data_js = to_js(JsonObject(data))
    data_py = to_py(data_js)

    assert isinstance(data_py, dict)

    assert data_py['a'] == 1
    assert data_py['b'] == True
    assert data_py['c']['nested'] == True
