from pathlib import Path

import itk

from itkwasm import Image
from dataclasses import asdict
import numpy as np

def test_image():
    data = Path(__file__).absolute().parent / "input" / "cthead1.png"
    itk_image = itk.imread(data, itk.UC)
    itk_image_dict = itk.dict_from_image(itk_image)
    itkwasm_image = Image(**itk_image_dict)
    itkwasm_image_dict = asdict(itkwasm_image)
    itk_image_roundtrip = itk.image_from_dict(itkwasm_image_dict)
    difference = np.sum(itk.comparison_image_filter(itk_image, itk_image_roundtrip))
    assert difference == 0.0