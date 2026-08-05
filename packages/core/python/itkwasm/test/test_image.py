import copy
from pathlib import Path

import itk

from itkwasm import Image, ImageRegion, ImageType
from dataclasses import asdict
import numpy as np


def test_image():
    data = Path(__file__).absolute().parent / "input" / "cthead1.png"
    itk_image = itk.imread(data, itk.UC)
    itk_image_dict = itk.dict_from_image(itk_image)
    itkwasm_image = Image(**itk_image_dict)
    assert itkwasm_image.bufferedRegion.index[0] == 0
    assert itkwasm_image.bufferedRegion.index[1] == 0
    assert itkwasm_image.bufferedRegion.size[0] == 256
    assert itkwasm_image.bufferedRegion.size[1] == 256
    itkwasm_image_dict = asdict(itkwasm_image)
    itk_image_roundtrip = itk.image_from_dict(itkwasm_image_dict)
    difference = np.sum(itk.comparison_image_filter(itk_image, itk_image_roundtrip))
    assert difference == 0.0


def test_image_defaults():
    image = Image()

    assert image.imageType.dimension == 2
    assert image.imageType.componentType == "uint8"
    assert image.imageType.pixelType == "Scalar"
    assert image.imageType.components == 1

    assert image.name == "Image"
    assert image.origin[0] == 0.0
    assert image.origin[1] == 0.0
    assert image.spacing[0] == 1.0
    assert image.spacing[1] == 1.0
    assert np.array_equal(image.direction, np.eye(2).astype(np.float64))

    assert image.size[0] == 1
    assert image.size[1] == 1

    assert isinstance(image.metadata, dict)
    assert image.data == None


def test_image_with_data():
    """Test creating an Image with data."""
    image_type = ImageType(
        dimension=2,
        componentType="uint8",
        pixelType="Scalar",
        components=1,
    )
    data = np.zeros((5, 6), dtype=np.uint8)

    image = Image(
        imageType=image_type,
        data=data,
    )

    assert image.imageType.dimension == 2
    assert image.imageType.componentType == "uint8"
    assert image.imageType.pixelType == "Scalar"
    assert image.imageType.components == 1

    assert image.name == "Image"
    assert image.origin[0] == 0.0
    assert image.origin[1] == 0.0
    assert image.spacing[0] == 1.0
    assert image.spacing[1] == 1.0
    assert np.array_equal(image.direction, np.eye(2).astype(np.float64))

    assert image.size[0] == 1
    assert image.size[1] == 1

    assert isinstance(image.metadata, dict)
    assert np.array_equal(image.data, data)
    assert image.bufferedRegion.index[0] == 0
    assert image.bufferedRegion.index[1] == 0
    assert image.bufferedRegion.size[0] == 6
    assert image.bufferedRegion.size[1] == 5


def test_image_data_set_after_construction():
    """The buffered region follows data assigned after construction."""
    image = Image()
    image.size = [4, 4]
    image.data = np.arange(16, dtype=np.uint8).reshape((4, 4))

    assert image.size == [4, 4]
    assert list(image.bufferedRegion.index) == [0, 0]
    assert list(image.bufferedRegion.size) == [4, 4]

    # The largest possible region is not the buffered region
    image.size = [8, 8]
    assert list(image.bufferedRegion.size) == [4, 4]


def test_image_information_only():
    """An explicit buffered region is preserved."""
    image = Image(
        size=[4, 4],
        bufferedRegion=ImageRegion(index=[0, 0], size=[0, 0]),
        data=np.empty((0, 0), dtype=np.uint8),
    )

    assert image.size == [4, 4]
    assert list(image.bufferedRegion.size) == [0, 0]


def test_image_buffered_region_does_not_alias_size():
    """The default buffered region is not the largest possible region."""
    image = Image(size=[4, 4])
    assert list(image.bufferedRegion.size) == [4, 4]

    image.size[0] = 8
    assert list(image.bufferedRegion.size) == [4, 4]


def test_image_data_preserves_buffered_region_index():
    """A buffered region index survives data assignment."""
    image = Image(size=[8, 8], bufferedRegion=ImageRegion(index=[2, 2], size=[1, 1]))
    image.data = np.zeros((4, 4), dtype=np.uint8)

    assert list(image.bufferedRegion.index) == [2, 2]
    assert list(image.bufferedRegion.size) == [4, 4]


def test_image_data_on_a_shallow_copy():
    """Data assigned to a shallow copy does not change the original region."""
    image = Image(size=[4, 4], data=np.zeros((4, 4), dtype=np.uint8))
    copied = copy.copy(image)
    copied.data = np.zeros((2, 2), dtype=np.uint8)

    assert list(image.bufferedRegion.size) == [4, 4]
    assert list(copied.bufferedRegion.size) == [2, 2]


def test_image_vector_data():
    """The buffered region excludes the components axis."""
    image_type = ImageType(
        dimension=2,
        componentType="uint8",
        pixelType="VariableLengthVector",
        components=3,
    )
    image = Image(imageType=image_type)
    image.size = [5, 4]
    image.data = np.zeros((4, 5, 3), dtype=np.uint8)

    assert list(image.bufferedRegion.size) == [5, 4]


def test_image_type_assigned_a_dict():
    """A dict imageType is converted however it is assigned."""
    image = Image()
    image.imageType = {
        "dimension": 3,
        "componentType": "uint16",
        "pixelType": "Scalar",
        "components": 1,
    }

    assert isinstance(image.imageType, ImageType)
    assert image.imageType.dimension == 3

    image.size = [4, 3, 2]
    image.data = np.zeros((2, 3, 4), dtype=np.uint16)
    assert list(image.bufferedRegion.size) == [4, 3, 2]


def test_buffered_region_assigned_a_dict():
    """A dict bufferedRegion is converted however it is assigned."""
    image = Image(size=[4, 4])
    image.bufferedRegion = {"index": [0, 0], "size": [2, 2]}

    assert isinstance(image.bufferedRegion, ImageRegion)
    assert list(image.bufferedRegion.size) == [2, 2]

    image.data = np.zeros((4, 4), dtype=np.uint8)
    assert list(image.bufferedRegion.size) == [4, 4]


def test_image_data_without_a_region_shape():
    """Data that does not describe the buffered region leaves it alone."""
    image = Image(size=[4, 4], bufferedRegion=ImageRegion(index=[0, 0], size=[4, 4]))

    # A raveled buffer
    image.data = np.zeros(16, dtype=np.uint8)
    assert list(image.bufferedRegion.size) == [4, 4]

    # A data: URI, as found in pipeline output JSON
    image.data = "data:application/vnd.itk.path,data/data.raw"
    assert list(image.bufferedRegion.size) == [4, 4]
