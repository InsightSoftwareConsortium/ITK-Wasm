import numpy as np

from itkwasm import image_from_array, ImageType, PixelTypes, IntTypes, FloatTypes


def test_image_from_array():
    arr = np.random.rand(10, 10)
    image = image_from_array(arr)
    assert np.array_equal(arr, image.data)
    assert image.imageType.dimension == 2
    assert image.imageType.componentType == FloatTypes.Float64
    assert image.imageType.pixelType == PixelTypes.Scalar
    assert image.imageType.components == 1


def test_image_from_array_anisotropic():
    arr = np.random.rand(10, 5)
    image = image_from_array(arr)
    assert np.array_equal(arr, image.data)
    assert image.imageType.dimension == 2
    assert image.imageType.componentType == FloatTypes.Float64
    assert image.imageType.pixelType == PixelTypes.Scalar
    assert image.imageType.components == 1
    assert image.size[0] == 5
    assert image.size[1] == 10


def test_image_from_array_vector():
    arr = np.random.rand(10, 10, 3)
    image = image_from_array(arr, is_vector=True)
    assert np.array_equal(arr, image.data)
    assert image.imageType.dimension == 2
    assert image.imageType.componentType == FloatTypes.Float64
    assert image.imageType.pixelType == PixelTypes.VariableLengthVector
    assert image.imageType.components == 3


def test_image_from_array_explicit():
    arr = np.random.rand(10, 10, 3)
    image_type = {
        "dimension": 2,
        "componentType": FloatTypes.Float32,
        "pixelType": PixelTypes.VariableLengthVector,
        "components": 3,
    }
    image_type = ImageType(**image_type)
    image = image_from_array(arr, image_type=image_type)
    assert np.array_equal(arr, image.data)
    assert image.imageType.dimension == 2
    assert image.imageType.componentType == FloatTypes.Float32
    assert image.imageType.pixelType == PixelTypes.VariableLengthVector
    assert image.imageType.components == 3
