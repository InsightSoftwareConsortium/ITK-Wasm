from pathlib import Path

import itk

from itkwasm import Image
from itkwasm import FloatTypes, PixelTypes
import numpy as np

from itkwasm import cast_image


def test_cast_image_component():
    data = Path(__file__).absolute().parent / "input" / "cthead1.png"
    itk_image = itk.imread(data, itk.UC)
    itk_image_dict = itk.dict_from_image(itk_image)
    itkwasm_image = Image(**itk_image_dict)

    itkwasm_image_double = cast_image(itkwasm_image, component_type=FloatTypes.Float64)
    assert itkwasm_image_double.imageType.componentType == FloatTypes.Float64
    assert np.array_equal(itkwasm_image.data, itkwasm_image_double.data)


def test_cast_image_pixel_type():
    data = Path(__file__).absolute().parent / "input" / "cthead1.png"
    itk_image = itk.imread(data, itk.UC)
    itk_image_dict = itk.dict_from_image(itk_image)
    itkwasm_image = Image(**itk_image_dict)

    itkwasm_image_vector = cast_image(itkwasm_image, pixel_type=PixelTypes.VariableLengthVector)
    assert itkwasm_image_vector.imageType.pixelType == PixelTypes.VariableLengthVector
    assert np.array_equal(itkwasm_image.data, itkwasm_image_vector.data)
